import { NextFunction, Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';

import { CreateDischargeType } from 'src/schemas/discharge.schema';

const prisma = new PrismaClient();

export const getAll = asyncHandler(
  async (_req: Request<unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const discharges = await prisma.discharges.findMany({
        include: { User: true, DischargeDetails: true, Warehouses: true },
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
        include: { User: true, DischargeDetails: true, Warehouses: true },
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
      const cost = cart.reduce((acc, item) => acc + Number(item.quantity) * Number(item.cost), 0);

      const { id } = await prisma.discharges.create({ data: { warehouseId, userId, cost } });

      // Balance
      await prisma.movements.create({ data: { amount: cost, type: 'OUT', userId } });

      // Discharge Details
      const productsIds = cart.map((item) => item.productId).sort();

      const cartWithWarehouseId = cart
        .map((item) => ({
          dischargeId: id,
          reasonId: item.reasonId,
          productId: item.productId,
          quantity: item.quantity,
          info: item.info,
        }))
        .sort((a, b) => a.productId - b.productId);

      const discharge = await prisma.dischargeDetails.createMany({ data: cartWithWarehouseId });

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
