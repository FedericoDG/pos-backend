import { NextFunction, Response, Request } from 'express';
import { MovementType, PrismaClient, Users } from '@prisma/client';
import createHttpError from 'http-errors';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';
import { getMovementsType } from 'src/schemas/movement.schema';

const prisma = new PrismaClient();

interface Data {
  userId?: number;
  paymentMethodId?: number;
}

export const getAll = asyncHandler(
  async (req: Request<unknown, unknown, unknown, getMovementsType>, res: Response, next: NextFunction) => {
    try {
      const { userId, paymentMethodId, from, to } = req.query;
      const parsedFrom = new Date(from!.concat(' 00:00:00'));
      const parsedTo = new Date(to!.concat(' 23:59:59'));

      const data: Data = { userId: Number(userId), paymentMethodId: Number(paymentMethodId) };
      let user: Users | null = null;

      if (userId === '0') {
        delete data.userId;
      } else {
        user = await prisma.users.findFirst({ where: { id: Number(userId) } });
      }

      if (paymentMethodId === '0') {
        delete data.paymentMethodId;
      }

      const movements = await prisma.movements.findMany({
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
          user,
          movements,
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
