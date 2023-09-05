import { NextFunction, Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';

import { CreatePriceManyPercentageType, CreatePriceType } from '../schemas/price.schema';

const prisma = new PrismaClient();

export const create = asyncHandler(
  async (req: Request<unknown, unknown, CreatePriceType>, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      const price = await prisma.prices.create({ data });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Precio creado',
        body: {
          price,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Prices - CREATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const createManyPercentage = asyncHandler(
  async (req: Request<unknown, unknown, CreatePriceManyPercentageType>, res: Response, next: NextFunction) => {
    try {
      const prices = await prisma.prices.createMany({ data: req.body.cart });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Precios creados',
        body: {
          prices,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Prices - CREATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const remove = asyncHandler(
  async (req: Request<{ id?: number }, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const prices = await prisma.prices.delete({
        where: { id: Number(id) },
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Precio eliminado',
        body: {
          prices,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Prices - DELETE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);
