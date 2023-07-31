import { NextFunction, Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';

import { CreateCashRegisterType, UpdateCashRegisterType } from 'src/schemas/cashRegister.schema';

const prisma = new PrismaClient();

export const getAll = asyncHandler(
  async (_req: Request<unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const cashRegisters = await prisma.cashRegisters.findMany({
        include: {
          user: { include: { role: true } },
          /*   cashMovements: {
            include: {
              user: { include: { role: true } },
              cashMovementsDetails: {
                include: { product: { include: { category: true, unit: true } } },
                orderBy: [{ id: 'desc' }],
              },
            },
            orderBy: [{ id: 'desc' }],
          }, */
        },
        orderBy: [{ id: 'desc' }],
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Cajas recuperadas',
        body: {
          cashRegisters,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Cash Registers - GET ALL]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const getById = asyncHandler(
  async (req: Request<{ id?: number }, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const cashRegister = await prisma.cashRegisters.findFirst({
        where: { id: Number(id) },
        include: {
          user: { include: { role: true } },
          cashMovements: {
            include: {
              client: true,
              warehouse: true,
              paymentMethodDetails: { include: { paymentMethod: true } },
              cashMovementsDetails: {
                include: { product: { include: { category: true, unit: true } } },
                orderBy: [{ id: 'desc' }],
              },
            },
            orderBy: [{ id: 'desc' }],
          },
        },
        orderBy: [{ id: 'desc' }],
      });

      const cash =
        cashRegister?.cashMovements.map((el) =>
          el.paymentMethodDetails.filter((el) => el.paymentMethodId === 1).reduce((acc, el) => acc + el.amount, 0),
        )[0] || 0;
      const debit =
        cashRegister?.cashMovements.map((el) =>
          el.paymentMethodDetails.filter((el) => el.paymentMethodId === 2).reduce((acc, el) => acc + el.amount, 0),
        )[0] || 0;
      const credit =
        cashRegister?.cashMovements.map((el) =>
          el.paymentMethodDetails.filter((el) => el.paymentMethodId === 3).reduce((acc, el) => acc + el.amount, 0),
        )[0] || 0;
      const transfer =
        cashRegister?.cashMovements.map((el) =>
          el.paymentMethodDetails.filter((el) => el.paymentMethodId === 4).reduce((acc, el) => acc + el.amount, 0),
        )[0] || 0;
      const mercadoPago =
        cashRegister?.cashMovements.map((el) =>
          el.paymentMethodDetails.filter((el) => el.paymentMethodId === 5).reduce((acc, el) => acc + el.amount, 0),
        )[0] || 0;

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Caja recuperada',
        body: {
          cashRegister: { ...cashRegister, cash, debit, credit, transfer, mercadoPago },
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Cash Register - GET ONE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const status = asyncHandler(
  async (req: Request<unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const { id: userId } = req.user;
      const cashRegister = await prisma.cashRegisters.findFirst({
        where: { userId },
        include: { user: true },
        orderBy: [{ id: 'desc' }],
      });

      if (!cashRegister || cashRegister?.closingDate) {
        endpointResponse({
          res,
          code: 200,
          status: true,
          message: 'Estado de la Caja',
          body: {
            cashRegister: {
              ...cashRegister,
              isOpen: false,
            },
          },
        });
      } else {
        endpointResponse({
          res,
          code: 200,
          status: true,
          message: 'Estado de la Caja',
          body: {
            cashRegister: {
              ...cashRegister,
              isOpen: true,
            },
          },
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Cash Register - GET ONE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const open = asyncHandler(
  async (req: Request<unknown, unknown, CreateCashRegisterType>, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const { id: userId } = req.user;

      const cashRegister = await prisma.cashRegisters.create({ data: { ...data, finalBalance: 0, userId } });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Caja creada',
        body: {
          cashRegister,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Cash Registers - CREATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const close = asyncHandler(
  async (req: Request<unknown, unknown, UpdateCashRegisterType>, res: Response, next: NextFunction) => {
    try {
      const { id: userId } = req.user;
      const data = req.body;

      const actualCashRegister = await prisma.cashRegisters.findFirst({ where: { userId }, orderBy: [{ id: 'desc' }] });

      const cashRegister = await prisma.cashRegisters.update({
        where: { id: Number(actualCashRegister?.id) },
        data,
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Caja cerrada',
        body: {
          cashRegister,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Purchases - CREATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);
