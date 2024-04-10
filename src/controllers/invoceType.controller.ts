import { NextFunction, Response, Request } from 'express';
import createHttpError from 'http-errors';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';
import prisma from '../helpers/prisma';

export const getAll = asyncHandler(
  async (_req: Request<unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const invoceTypes = await prisma.invoceTypes.findMany();

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Tipos de comprobantes Recuperados',
        body: {
          invoceTypes,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Invoce Types - GET ALL]: ${error.message}`);
        next(httpError);
      }
    }
  },
);
