import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { endpointResponse } from '../helpers/endpointResponse';
import prisma from '../helpers/prisma';

export const checkDischarge = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.cart.lenght > 1) next();

    const productStrock = await prisma.stocks.findFirst({
      where: { warehouseId: req.body.warehouseId, productId: req.body.cart[0].productId },
    });
    if (productStrock?.stock && productStrock?.stock >= req.body.cart[0].quantity) {
      next();
    } else {
      endpointResponse({
        res,
        code: 400,
        status: false,
        message: 'Error',
        body: {
          message: `La pérdida no pueden ser mayores al stock: ${productStrock?.stock}`,
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
