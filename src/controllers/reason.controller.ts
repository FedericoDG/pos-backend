import { NextFunction, Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';

import { CreateReasonType, UpdateReasonType } from 'src/schemas/reason.schema';

const prisma = new PrismaClient();

export const getAll = asyncHandler(
  async (_req: Request<unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const reasons = await prisma.reasons.findMany();

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Razones recuperadas',
        body: {
          reasons,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Reasons - GET ALL]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const getById = asyncHandler(
  async (req: Request<{ id?: number }, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const reason = await prisma.reasons.findFirst({
        where: { id: Number(id) },
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Razón recuperada',
        body: {
          reason,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Reasons - GET ONE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const create = asyncHandler(
  async (req: Request<unknown, unknown, CreateReasonType>, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      const category = await prisma.reasons.create({ data });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Categoría creada',
        body: {
          category,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Category - CREATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const update = asyncHandler(
  async (req: Request<{ id?: number }, unknown, UpdateReasonType>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { reason: info } = req.body;

      const reason = await prisma.reasons.update({
        where: { id: Number(id) },
        data: { reason: info },
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Razón actualizada',
        body: {
          reason,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Reasons - UPDATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const remove = asyncHandler(
  async (req: Request<{ id?: number }, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const reason = await prisma.reasons.delete({
        where: { id: Number(id) },
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Razón eliminada',
        body: {
          reason,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Reasons - DELETE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);
