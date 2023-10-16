import { NextFunction, Response, Request } from 'express';
import { MovementType, PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';
import { getMovementsType } from 'src/schemas/movement.schema';

//import { CreateCashMovementsType } from '../schemas/cashMovement.schema';

const prisma = new PrismaClient();

export const getAll = asyncHandler(
  async (req: Request<unknown, unknown, getMovementsType>, res: Response, next: NextFunction) => {
    try {
      const { userId, paymentMethodId, from, to } = req.body;
      const parsedFrom = new Date(from.concat(' 00:00:00'));
      const parsedTo = new Date(to.concat(' 23:59:59'));

      const data: { userId?: number; paymentMethodId?: number } = {};

      if (userId) {
        data.userId = userId;
      }

      if (paymentMethodId) {
        data.paymentMethodId = paymentMethodId;
      }

      const movements = await prisma.movements.findMany({
        where: {
          ...data,
          createdAt: {
            lte: parsedTo,
            gte: parsedFrom,
          },
        },
        include: { user: { include: { role: true } }, paymentMethod: true },
        orderBy: [{ id: 'desc' }],
      });

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
          movements,
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

export const getById = asyncHandler(
  async (req: Request<{ id?: number }, unknown, getMovementsType>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { userId, paymentMethodId, from, to } = req.body;

      const parsedFrom = new Date(from.concat(' 00:00:00'));
      const parsedTo = new Date(to.concat(' 23:59:59'));

      const data: { userId?: number; paymentMethodId?: number } = {};

      if (userId) {
        data.userId = userId;
      }

      if (paymentMethodId) {
        data.paymentMethodId = paymentMethodId;
      }

      const movement = await prisma.movements.findFirst({
        where: {
          ...data,
          id: Number(id),
          createdAt: {
            lte: parsedTo,
            gte: parsedFrom,
          },
        },
        include: {
          user: { include: { role: true } },
          paymentMethod: true,
        },
        orderBy: [{ id: 'desc' }],
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Movimiento recuperado',
        body: {
          movement,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Movement - GET ONE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

/* export const create = asyncHandler(
  async (req: Request<unknown, unknown, CreateCashMovementsType>, res: Response, next: NextFunction) => {
    try {
      const {
        warehouseId,
        clientId,
        discount,
        discountPercent,
        recharge,
        rechargePercent,
        cart,
        payments,
        info,
        invoceTypeId,
        otherTributes,
        iva,
      } = req.body;
      const { id: userId } = req.user;

      const cashRegister = await prisma.cashRegisters.findFirst({ where: { userId }, orderBy: [{ id: 'desc' }] });
      const settings = await prisma.settings.findFirst({ select: { invoceNumber: true } });
      const afip = await prisma.afip.findFirst({ select: { posNumber: true } });

      const productsIds = cart.map((item) => item.productId);
      const subtotalOtherTributes = otherTributes.reduce((acc, item) => acc + item.amount, 0);
      const subtotal = cart.reduce((acc, item) => acc + item.quantity * item.price * (1 + item.tax), 0);
      const cashRegisterId = cashRegister?.id || 1;
      const cashRegisterFinalBalance = cashRegister?.finalBalance || 0;
      const finalBalance = cashRegisterFinalBalance + subtotal + subtotalOtherTributes;

      // Update Cash Register
      await prisma.cashRegisters.update({
        where: { id: cashRegisterId },
        data: { finalBalance: finalBalance },
      });

      const data: any = {
        iva,
        cashRegisterId,
        subtotal: subtotal,
        discount,
        discountPercent,
        recharge,
        rechargePercent,
        otherTributes: subtotalOtherTributes,
        total: subtotal + subtotalOtherTributes,
        warehouseId,
        clientId,
        userId,
        posNumber: afip?.posNumber || 1,
        invoceTypeId,
        invoceNumber: settings?.invoceNumber || 0,
        info,
      };

      // Create Cash Movement
      const cashMovement = await prisma.cashMovements.create({ data });

      // Create Cash Movement Details
      const cashMovementId = cashMovement.id;

      const cartWithcashMovementId = cart.map((item) => ({
        productId: item.productId,
        price: item.price,
        quantity: item.quantity,
        tax: item.tax,
        cashMovementId,
      }));

      await prisma.cashMovementsDetails.createMany({ data: cartWithcashMovementId });

      // Create Payments Details
      const reducedPayments = payments.reduce((accumulator, payment) => {
        const paymentMethodId = payment.paymentMethodId;
        if (!accumulator[paymentMethodId]) {
          accumulator[paymentMethodId] = {
            amount: 0,
            paymentMethodId: paymentMethodId,
          };
        }
        accumulator[paymentMethodId].amount += payment.amount;
        return accumulator;
      }, {});

      const reducedPaymentsArray: Array<{ amount: number; paymentMethodId: number }> = Object.values(reducedPayments);
      const mappedPayments = reducedPaymentsArray.map((item) => ({ ...item, cashMovementId }));

      await prisma.paymentMethodDetails.createMany({ data: mappedPayments });

      // Create Other Tributes Details
      const mappedOtherTributes = otherTributes.map((item) => ({
        amount: item.amount,
        otherTributeId: item.otherTributeId,
        cashMovementId,
      }));

      await prisma.otherTributesDetails.createMany({ data: mappedOtherTributes });

      // Stock Origin
      const stocks = await prisma.stocks.findMany({
        where: { productId: { in: productsIds }, warehouseId },
        orderBy: [{ createdAt: 'asc' }],
      });

      const uniqueStocksOrigin = stocks.reduce((acc: any[], current) => {
        const existingStock = acc.find((stock) => stock.productId === current.productId);

        if (!existingStock) {
          acc.push(current);
        }

        return acc;
      }, []);

      uniqueStocksOrigin.sort((a, b) => a.productId - b.productId);
      cart.sort((a, b) => a.productId - b.productId);

      const newStock = uniqueStocksOrigin.map((item, idx) => {
        return {
          id: item.id,
          productId: item.productId,
          warehouseId: warehouseId,
          stock: item.stock - cart[idx].quantity,
          prevstock: item.stock,
          prevdate: item.createdAt,
        };
      });

      await Promise.all(
        newStock.map(
          async (el) =>
            await prisma.stocks.update({
              where: { id: el.id },
              data: { ...el },
            }),
        ),
      );

      // Update Invoce Number
      await prisma.settings.update({ where: { id: 1 }, data: { invoceNumber: { increment: 1 } } });

      /// TODO
      // Create Movement
      // await prisma.movements.create({ data: { type: 'IN', amount: subtotal + subtotalOtherTributes, userId } });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Movimiento creado',
        body: {
          cashMovement,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Cash Movements - CREATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
); */

//TODO Undo Cash Movement
