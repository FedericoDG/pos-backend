import { NextFunction, Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';

import { CreateDischargeType, UpdateDischargeType } from 'src/schemas/discharge.schema';

const prisma = new PrismaClient();

export const getAll = asyncHandler(
  async (_req: Request<unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const discharges = await prisma.discharges.findMany({
        include: { products: true, reason: true, warehouses: true },
        orderBy: [{ createdAt: 'desc' }],
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Bajas de productos recuperadas',
        body: {
          discharges,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Discharges - GET ALL]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const getById = asyncHandler(
  async (req: Request<{ id?: number }, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const discharge = await prisma.discharges.findFirst({
        where: { id: Number(id) },
        include: { products: true, reason: true, warehouses: true },
        orderBy: [{ createdAt: 'desc' }],
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Baja de producto recuperada',
        body: {
          discharge,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Discharges - GET ONE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const create = asyncHandler(
  async (req: Request<unknown, unknown, CreateDischargeType>, res: Response, next: NextFunction) => {
    try {
      const { id: userId } = req.user;
      const { warehouseId, cart } = req.body;
      cart.sort((a, b) => a.productId - b.productId);

      // Discharge
      const productsIds = cart.map((item) => item.productId).sort();

      const cartWithWarehouseId = cart
        .map((item) => ({ warehouseId, ...item }))
        .sort((a, b) => a.productId - b.productId);

      const discharge = await prisma.discharges.createMany({ data: cartWithWarehouseId });

      const stocks = await prisma.stocks.findMany({
        where: { productId: { in: productsIds }, warehouseId: warehouseId },
        orderBy: [{ id: 'asc' }],
      });

      // Update Stock
      const newStock = stocks.map((item, idx) => {
        return {
          id: item.id,
          productId: item.productId,
          warehouseId: warehouseId,
          stock: item.stock - cart[idx].quantity,
          prevstock: item.stock,
          prevdate: item.createdAt,
        };
      });

      await Promise.all(
        newStock.map(
          async (el) =>
            await prisma.stocks.update({
              where: { id: el.id },
              data: { ...el },
            }),
        ),
      );

      // Balance
      const products = await prisma.products.findMany({
        where: { id: { in: productsIds } },
        select: { costs: { select: { price: true, productId: true }, orderBy: [{ id: 'desc' }], take: 1 } },
        orderBy: [{ id: 'asc' }],
      });

      const cost = products
        .map((el) => ({ price: el.costs[0].price }))
        .reduce((acc, item, idx) => acc + item.price * cart[idx].quantity, 0);
      await prisma.movements.create({ data: { amount: cost, type: 'OUT', userId } });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Baja de producto creada',
        body: {
          discharge,
          cost,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Discharges - CREATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const update = asyncHandler(
  async (req: Request<{ id?: number }, unknown, UpdateDischargeType>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { info } = req.body;

      const unit = await prisma.discharges.update({
        where: { id: Number(id) },
        data: { info },
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Bajar de producto actualizada',
        body: {
          unit,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Discharges - UPDATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);
