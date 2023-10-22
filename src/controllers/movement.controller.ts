import { NextFunction, Response, Request } from 'express';
import { Clients, MovementType, PrismaClient, Users } from '@prisma/client';
import createHttpError from 'http-errors';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';
import { getMovementsType } from 'src/schemas/movement.schema';

const prisma = new PrismaClient();

interface Data {
  userId?: number;
  paymentMethodId?: number;
}

type Client = Clients & { total: number };
type User = Users & { total: number };

export const getAll = asyncHandler(
  async (req: Request<unknown, unknown, unknown, getMovementsType>, res: Response, next: NextFunction) => {
    try {
      const { userId, clientId, paymentMethodId, from, to } = req.query;
      const parsedFrom = new Date(from!.concat(' 00:00:00'));
      const parsedTo = new Date(to!.concat(' 23:59:59'));

      const data: Data = {
        userId: Number(userId),
        paymentMethodId: Number(paymentMethodId),
      };

      let user: Users | null = null;

      if (userId === '0') {
        delete data.userId;
      } else {
        user = await prisma.users.findFirst({ where: { id: Number(userId) } });
      }

      if (paymentMethodId === '0') {
        delete data.paymentMethodId;
      }

      const cashMovements = await prisma.cashMovements.findMany({
        where: {
          createdAt: {
            gte: parsedFrom,
            lte: parsedTo,
          },
        },
        include: { user: { include: { role: true } }, client: { include: { identification: true } } },
        orderBy: [{ createdAt: 'desc' }],
      });

      const ids = cashMovements.map((el) => el.id);

      const paymentMethodDetails = await prisma.paymentMethodDetails.findMany({
        where: {
          id: { in: ids },
        },
        orderBy: [{ createdAt: 'desc' }],
      });

      let mappedCashMovements = cashMovements.map((el, id) => ({
        ...el,
        paymentMethodDetails: paymentMethodDetails[id],
      }));

      if (userId !== '0') {
        mappedCashMovements = mappedCashMovements.filter((el) => el.userId === Number(userId));
      } else {
        console.log('NO HAY FILTRO DE USUARIO');
      }

      let clients = mappedCashMovements.reduce((acc: Client[], curr) => {
        const exist = acc.find((el) => el.id === curr.client.id);

        if (exist) {
          if (curr.invoceTypeId === 5 || curr.invoceTypeId === 6 || curr.invoceTypeId === 7) {
            exist.total -= curr.total;
          } else {
            exist.total += curr.total;
          }
        } else {
          acc.push({
            ...curr.client,
            total: curr.total,
          });
        }

        return acc;
      }, []);

      if (clientId !== '0') {
        clients = clients.filter((el) => el.id === Number(clientId));
      }

      const users = mappedCashMovements.reduce((acc: User[], curr) => {
        const exist = acc.find((el) => el.id === curr.user.id);

        if (exist) {
          if (curr.invoceTypeId === 5 || curr.invoceTypeId === 6 || curr.invoceTypeId === 7) {
            exist.total -= curr.total;
          } else {
            exist.total += curr.total;
          }
        } else {
          acc.push({
            ...curr.user,
            total: curr.total,
          });
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

      let movements = await prisma.movements.findMany({
        where: {
          ...data,
          createdAt: {
            gte: parsedFrom,
            lte: parsedTo,
          },
        },
        include: { user: { include: { role: true } }, paymentMethod: true },
        orderBy: [{ id: 'desc' }],
      });

      if (paymentMethodId !== '0') {
        movements = movements.filter((el) => el.paymentMethodId === Number(paymentMethodId));
      } else {
        console.log('NO HAY FILTRO DE METODO DE PAGO');
      }

      const incomes = movements.filter((el) => el.type === MovementType.IN);
      const totalIncomes = incomes.reduce((acc, el) => acc + el.amount, 0) || 0;
      const totalCash = incomes.filter((el) => el.paymentMethodId === 1).reduce((acc, el) => acc + el.amount, 0) || 0;
      const totalDebit = incomes.filter((el) => el.paymentMethodId === 2).reduce((acc, el) => acc + el.amount, 0) || 0;
      const totalCredit = incomes.filter((el) => el.paymentMethodId === 3).reduce((acc, el) => acc + el.amount, 0) || 0;
      const totalTransfer =
        incomes.filter((el) => el.paymentMethodId === 4).reduce((acc, el) => acc + el.amount, 0) || 0;
      const totalMercadoPago =
        incomes.filter((el) => el.paymentMethodId === 5).reduce((acc, el) => acc + el.amount, 0) || 0;

      const outcomes = movements.filter((el) => el.type === MovementType.OUT);
      const totalOutcomes = outcomes.reduce((acc, el) => acc + el.amount, 0) || 0;

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Movimientos recuperados',
        body: {
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
            totalOutcomes,
          },
          discounts,
          recharges,
          otherTributes,
          invoices: {
            invoiceAFIPCount:
              invoiceACount + invoiceBCount + invoiceMCount + invoiceNCACount + invoiceNCBCount + invoiceNCMCount,
            invoiceAFIPTotal:
              invoiceATotal + invoiceBTotal + invoiceMTotal - invoiceNCATotal - invoiceNCBTotal - invoiceNCMTotal,
            //
            invoiceAFIPNCCount: invoiceNCACount + invoiceNCBCount + invoiceNCMCount,
            invoiceAFIPNCTotal: invoiceNCATotal + invoiceNCBTotal + invoiceNCMTotal,
            //
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
          },
          movements,
          clients,
          users,
          user,
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
