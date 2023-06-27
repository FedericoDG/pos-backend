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
          cashMovements: {
            include: {
              user: { include: { role: true } },
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
              user: { include: { role: true } },
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

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Caja recuperada',
        body: {
          cashRegister,
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
  async (_req: Request<unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const cashRegister = await prisma.cashRegisters.findFirst({ orderBy: [{ id: 'desc' }] });

      if (cashRegister?.closingDate) {
        endpointResponse({
          res,
          code: 200,
          status: true,
          message: 'Estado de la Caja',
          body: {
            isOpen: false,
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

      const cashRegister = await prisma.cashRegisters.create({ data: { ...data, userId } });

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
  async (req: Request<{ id?: number }, unknown, UpdateCashRegisterType>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = req.body;

      const cashRegister = await prisma.cashRegisters.update({
        where: { id: Number(id) },
        data,
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Caja actualizada',
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