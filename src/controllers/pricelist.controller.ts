import { NextFunction, Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';

import { CreatePriceListType, UpdatePriceListType } from 'src/schemas/pricelist.schema';
import { getList } from '../helpers/getList';

const prisma = new PrismaClient();

export const getAll = asyncHandler(
  async (_req: Request<unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const pricelists = await prisma.pricelists.findMany({
        orderBy: [
          {
            updatedAt: 'desc',
          },
        ],
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Listas de precio recuperadas',
        body: {
          pricelists,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[PriceLists - GET ALL]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const getByIdAndWarehouseId = asyncHandler(
  async (req: Request<{ id?: number; warehouseId?: number }, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const { id, warehouseId } = req.params;

      const pricelist = await prisma.pricelists.findFirst({
        where: { id: Number(id) },
        include: {
          prices: {
            include: { products: { include: { unit: true, category: true } } },
            orderBy: [{ createdAt: 'desc' }],
          },
        },
      });

      const stocks = await prisma.stocks.findMany({
        where: { warehouseId: Number(warehouseId) },
        include: {
          warehouses: true,
        },
      });

      const list = getList(pricelist, stocks, 'products');

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Lista de precio recuperada',
        body: {
          pricelist: list,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[PriceLists - GET ONE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const getByIdWarehouseIdAndProductId = asyncHandler(
  async (
    req: Request<{ id?: number; warehouseId?: number; productId?: number }, unknown, unknown>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id, warehouseId, productId } = req.params;

      const pricelist = await prisma.pricelists.findFirst({
        where: { id: Number(id) },
        include: {
          prices: {
            where: {
              productId: Number(productId),
            },
            include: { products: { include: { unit: true, category: true } } },
            orderBy: [{ createdAt: 'desc' }],
          },
        },
      });

      const stocks = await prisma.stocks.findMany({
        where: { warehouseId: Number(warehouseId) },
        include: {
          warehouses: true,
        },
      });

      const list = getList(pricelist, stocks, 'product');

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Lista de precio recuperada',
        body: {
          pricelist: list,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[PriceLists - GET ONEdfg]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const create = asyncHandler(
  async (req: Request<unknown, unknown, CreatePriceListType>, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      const pricelist = await prisma.pricelists.create({ data });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Lista de precio creada',
        body: {
          pricelist,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[PriceLists - CREATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const update = asyncHandler(
  async (req: Request<{ id?: number }, unknown, UpdatePriceListType>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { description } = req.body;

      const pricelist = await prisma.pricelists.update({
        where: { id: Number(id) },
        data: { description },
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Lista de precio actualizada',
        body: {
          pricelist,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[PriceLists - UPDATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const remove = asyncHandler(
  async (req: Request<{ id?: number }, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const pricelist = await prisma.pricelists.delete({
        where: { id: Number(id) },
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Lista de precio eliminada',
        body: {
          pricelist,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[PriceLists - DELETE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);
