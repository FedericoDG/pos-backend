import { NextFunction, Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';

const prisma = new PrismaClient();

export const getAll = asyncHandler(
  async (_req: Request<unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const ivaConditions = await prisma.ivaConditions.findMany();

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Condiciones de IVA Recuperadas',
        body: {
          ivaConditions,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[IVA Conditions - GET ALL]: ${error.message}`);
        next(httpError);
      }
    }
  },
);
