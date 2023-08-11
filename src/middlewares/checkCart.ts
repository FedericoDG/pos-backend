import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';
import { endpointResponse } from 'src/helpers/endpointResponse';

const prisma = new PrismaClient();

export const userExistMidd = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cart, warehouseId } = req.body;
    const filteredCart = cart.filter((el) => !el.allow);
    filteredCart.sort((a, b) => a.productId - b.productId);

    const ids = filteredCart.map((el) => el.productId);
    const stocks = await prisma.stocks.findMany({
      where: { warehouseId, productId: { in: ids } },
      select: { productId: true, stock: true },
    });

    const error: number[] = [];

    for (let index = 0; index < filteredCart.length; index++) {
      if (filteredCart[index].quantity > stocks[index].stock) error.push(filteredCart[index].productId);
    }

    if (error.length === 0) {
      next();
    } else {
      endpointResponse({
        res,
        code: 400,
        status: false,
        message: 'Error',
        body: {
          error,
        },
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      const httpError = createHttpError(500, `[Cash Registers - CHECK CART]: ${error.message}`);
      next(httpError);
    }
  }
};
