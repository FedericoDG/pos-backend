import { NextFunction, Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';

import { CreateCostType } from '../schemas/cost.schema';

const prisma = new PrismaClient();

export const create = asyncHandler(
  async (req: Request<unknown, unknown, CreateCostType>, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      const { cart } = data;

      // costs
      const costs = await prisma.costs.createMany({ data: cart });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Costos actualizados',
        body: {
          costs,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Costs - CREATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);
