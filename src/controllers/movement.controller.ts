import { NextFunction, Response, Request } from 'express';
import { Clients, MovementType, Users } from '@prisma/client';
import createHttpError from 'http-errors';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';
import { getMovementsType } from '../schemas/movement.schema';
import prisma from '../helpers/prisma';

interface Data {
  userId?: number;
  clientId?: number;
  paymentMethodId?: number;
}

type User = Users & { total: number };
type Client = Clients & { total: number };

export const getAll = asyncHandler(
  async (req: Request<unknown, unknown, unknown, getMovementsType>, res: Response, next: NextFunction) => {
    try {
      const { userId, clientId, paymentMethodId, invoices, from, to } = req.query;
      const invoicesIds: number[] = JSON.parse(invoices!);

      if (invoicesIds.includes(1)) invoicesIds.push(5);
      if (invoicesIds.includes(2)) invoicesIds.push(6);
      if (invoicesIds.includes(3)) invoicesIds.push(7);
      if (invoicesIds.includes(4)) invoicesIds.push(8);

      const parsedFrom = new Date(from!.concat(' 00:00:00'));
      const parsedTo = new Date(to!.concat(' 23:59:59'));

      const data: Data = {
        userId: Number(userId),
        clientId: Number(clientId),
        //paymentMethodId: Number(paymentMethodId),
      };

      let user: Users | null = null;
      let client: Clients | null = null;

      if (userId === '0') {
        delete data.userId;
      } else {
        user = await prisma.users.findFirst({ where: { id: Number(userId) } });
      }

      if (clientId === '0') {
        delete data.clientId;
      } else {
        client = await prisma.clients.findFirst({ where: { id: Number(clientId) } });
      }

      if (paymentMethodId === '0') {
        delete data.paymentMethodId;
      }

      const paymentMethodDetails = await prisma.paymentMethodDetails.findMany({
        where: {
          createdAt: {
            gte: parsedFrom,
            lte: parsedTo,
          },
          isCreditNote: 0,
        },
        select: {
          amount: true,
          paymentMethodId: true,
        },
      });

      let mappedCashMovements = await prisma.cashMovements.findMany({
        where: {
          invoceTypeId: { in: invoicesIds },
          createdAt: {
            gte: parsedFrom,
            lte: parsedTo,
          },
        },
        include: { user: { include: { role: true } }, client: { include: { identification: true } } },
        orderBy: [{ createdAt: 'desc' }],
      });

      if (userId !== '0') {
        mappedCashMovements = mappedCashMovements.filter((el) => el.userId === Number(userId));
      }

      if (clientId !== '0') {
        mappedCashMovements = mappedCashMovements.filter((el) => el.clientId === Number(clientId));
      }

      const creditNotesIds = [5, 6, 7, 8];

      const clients = mappedCashMovements.reduce((acc: Client[], curr) => {
        const exist = acc.find((el) => el.id === curr.client.id);

        if (exist) {
          if (creditNotesIds.includes(curr.invoceTypeId)) {
            exist.total -= curr.total;
          } else {
            exist.total += curr.total;
          }
        } else {
          if (creditNotesIds.includes(curr.invoceTypeId)) {
            acc.push({
              ...curr.client,
              total: curr.total * -1,
            });
          } else {
            acc.push({
              ...curr.client,
              total: curr.total,
            });
          }
        }

        return acc;
      }, []);

      const users = mappedCashMovements.reduce((acc: User[], curr) => {
        const exist = acc.find((el) => el.id === curr.user.id);

        if (exist) {
          if (creditNotesIds.includes(curr.invoceTypeId)) {
            exist.total -= curr.total;
          } else {
            exist.total += curr.total;
          }
        } else {
          if (creditNotesIds.includes(curr.invoceTypeId)) {
            acc.push({
              ...curr.user,
              total: curr.total * -1,
            });
          } else {
            acc.push({
              ...curr.user,
              total: curr.total,
            });
          }
        }
        return acc;
      }, []);

      const discounts = mappedCashMovements.reduce((acc, curr) => acc + curr.discount, 0) || 0;
      const recharges = mappedCashMovements.reduce((acc, curr) => acc + curr.recharge, 0) || 0;
      const otherTributes = mappedCashMovements.reduce((acc, curr) => acc + curr.otherTributes, 0) || 0;

      const invoiceA = mappedCashMovements.filter((el) => el.invoceTypeId === 1);
      const invoiceACount = invoiceA.length;
      const invoiceATotal = invoiceA.reduce((acc, el) => acc + el.total, 0) || 0;

      const invoiceB = mappedCashMovements.filter((el) => el.invoceTypeId === 2);
      const invoiceBCount = invoiceB.length;
      const invoiceBTotal = invoiceB.reduce((acc, el) => acc + el.total, 0) || 0;

      const invoiceM = mappedCashMovements.filter((el) => el.invoceTypeId === 3);
      const invoiceMCount = invoiceM.length;
      const invoiceMTotal = invoiceM.reduce((acc, el) => acc + el.total, 0) || 0;

      const invoiceX = mappedCashMovements.filter((el) => el.invoceTypeId === 4);
      const invoiceXCount = invoiceX.length;
      const invoiceXTotal = invoiceX.reduce((acc, el) => acc + el.total, 0) || 0;

      const invoiceNCA = mappedCashMovements.filter((el) => el.invoceTypeId === 5);
      const invoiceNCACount = invoiceNCA.length;
      const invoiceNCATotal = invoiceNCA.reduce((acc, el) => acc + el.total, 0) || 0;

      const invoiceNCB = mappedCashMovements.filter((el) => el.invoceTypeId === 6);
      const invoiceNCBCount = invoiceNCB.length;
      const invoiceNCBTotal = invoiceNCB.reduce((acc, el) => acc + el.total, 0) || 0;

      const invoiceNCM = mappedCashMovements.filter((el) => el.invoceTypeId === 7);
      const invoiceNCMCount = invoiceNCM.length;
      const invoiceNCMTotal = invoiceNCM.reduce((acc, el) => acc + el.total, 0) || 0;

      const invoiceNCX = mappedCashMovements.filter((el) => el.invoceTypeId === 8);
      const invoiceNCXCount = invoiceNCX.length;
      const invoiceNCXTotal = invoiceNCX.reduce((acc, el) => acc + el.total, 0) || 0;

      let movements = await prisma.movements.findMany({
        where: {
          ...data,
          OR: [{ concept: 'Venta' }, { concept: 'N. de Crédito' }],
          createdAt: {
            gte: parsedFrom,
            lte: parsedTo,
          },
        },
        include: { user: { include: { role: true } }, client: true, paymentMethod: true, cashMovement: true },
        orderBy: [{ id: 'desc' }],
      });

      movements = movements.filter((el) => invoicesIds?.includes(el.cashMovement!.invoceTypeId));

      const groupedMovements = movements.reduce((result: any, movement: any) => {
        const existingGroup = result.find((group) => group.cashMovement.id === movement.cashMovement.id);

        if (existingGroup) {
          existingGroup.amount += movement.amount;
          existingGroup.details.push({
            id: movement.paymentMethod.id,
            code: movement.paymentMethod.code,
            amount: movement.amount,
            concept: movement.concept,
            type: movement.type,
            createdAt: movement.createdAt,
          });
        } else {
          result.push({
            id: movement.cashMovement.id,
            amount: movement.amount,
            concept: movement.concept,
            type: movement.type,
            createdAt: movement.createdAt,
            cashMovement: movement.cashMovement,
            user: movement.user,
            client: movement.client,
            details: [
              {
                id: movement.paymentMethod.id,
                code: movement.paymentMethod.code,
                amount: movement.amount,
              },
            ],
          });
        }

        return result;
      }, []);

      const outcomes = movements.filter((el) => el.type === MovementType.OUT && el.concept !== 'N. de Crédito');
      const purchases = outcomes.filter((el) => el.concept === 'Compra').reduce((acc, el) => acc + el.amount, 0) || 0;
      const destroys =
        outcomes.filter((el) => el.concept === 'Baja/Pérdida').reduce((acc, el) => acc + el.amount, 0) || 0;
      const totalOutcomes = purchases + destroys;

      // const incomes = movements.filter((el) => el.type === MovementType.IN);

      const totalCash = paymentMethodDetails
        .filter((el) => el.paymentMethodId === 1)
        .reduce((acc, el) => acc + el.amount, 0);
      const totalDebit =
        paymentMethodDetails.filter((el) => el.paymentMethodId === 2).reduce((acc, el) => acc + el.amount, 0) || 0;
      const totalCredit =
        paymentMethodDetails.filter((el) => el.paymentMethodId === 3).reduce((acc, el) => acc + el.amount, 0) || 0;
      const totalTransfer =
        paymentMethodDetails.filter((el) => el.paymentMethodId === 4).reduce((acc, el) => acc + el.amount, 0) || 0;
      const totalMercadoPago =
        paymentMethodDetails.filter((el) => el.paymentMethodId === 5).reduce((acc, el) => acc + el.amount, 0) || 0;
      const totalIncomes = totalCash + totalDebit + totalCredit + totalTransfer + totalMercadoPago;

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Movimientos recuperados',
        body: {
          movements: groupedMovements,
          from: parsedFrom,
          to: parsedTo,
          incomes: {
            totalIncomes,
            totalCash,
            totalDebit,
            totalCredit,
            totalTransfer,
            totalMercadoPago,
          },
          outcomes: {
            purchases,
            destroys,
            totalOutcomes,
          },
          discounts,
          recharges,
          otherTributes,
          invoices: {
            invoiceAFIPCount:
              invoiceACount + invoiceBCount + invoiceMCount + invoiceNCACount + invoiceNCBCount + invoiceNCMCount,
            invoiceAFIPTotal:
              invoiceATotal + invoiceBTotal + invoiceMTotal - (invoiceNCATotal + invoiceNCBTotal + invoiceNCMTotal),
            //
            invoiceAFIPNCCount: invoiceNCACount + invoiceNCBCount + invoiceNCMCount,
            invoiceAFIPNCTotal: invoiceNCATotal + invoiceNCBTotal + invoiceNCMTotal,
            //
            invoiceNoAFIPCount: invoiceXCount + invoiceNCXCount,
            invoiceNoAFIPTotal: invoiceXTotal - invoiceNCXTotal,
            invoiceACount,
            invoiceATotal,
            invoiceBCount,
            invoiceBTotal,
            invoiceMCount,
            invoiceMTotal,
            invoiceXCount,
            invoiceXTotal,
            invoiceNCACount,
            invoiceNCATotal,
            invoiceNCBCount,
            invoiceNCBTotal,
            invoiceNCMCount,
            invoiceNCMTotal,
            invoiceNCXCount,
            invoiceNCXTotal,
          },
          clients,
          users,
          user,
          client,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Movements - GET ALL]: ${error.message}`);
        next(httpError);
      }
    }
  },
);
