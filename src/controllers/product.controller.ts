import { NextFunction, Response, Request } from 'express';
import { Prices, PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';

import { CreateProductType, UpdateProductType } from '../schemas/product.schema';

const prisma = new PrismaClient();

export const getAll = asyncHandler(
  async (_req: Request<unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const products = await prisma.products.findMany({
        orderBy: [
          {
            updatedAt: 'desc',
          },
        ],
        include: {
          stocks: { include: { warehouses: true } },
          // prices: { include: { pricelists: true } },
        },
      });

      const productsWithTotalStock = products.map((product) => {
        const totalStock = product.stocks.reduce((sum, stock) => {
          return sum + stock.stock;
        }, 0);

        return {
          ...product,
          totalStock,
        };
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Productos recuperados',
        body: {
          products: productsWithTotalStock,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Products - GET ALL]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const getById = asyncHandler(
  async (req: Request<{ id?: number }, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const product = await prisma.products.findFirst({
        where: { id: Number(id) },
        include: {
          stocks: { include: { warehouses: true } },
        },
      });

      const ids = [1, 2, 3];

      const priceDetails: Prices[][] = [];
      const prices: Prices[] = [];
      for (const idx of ids) {
        const fede = await prisma.prices.findMany({
          where: { productId: Number(id), pricelistId: idx },
          include: {
            products: true,
            pricelists: { select: { code: true, description: true, createdAt: true } },
          },
          orderBy: [
            {
              createdAt: 'desc',
            },
          ],
          take: 10,
        });

        if (fede !== null) prices.push(fede[0]);
        if (fede !== null) priceDetails.push(fede.sort((a, b) => a.id - b.id));
      }

      /* const result = priceDetails.flat().reduce((acc, obj) => {
        const key = obj['pricelists'].code;
        if (acc[key]) {
          acc[key].push(obj);
        } else {
          acc[key] = [obj];
        }
        return acc;
      }, {});

      console.log(result); */

      const totalStock = product?.stocks.reduce((sum, stock) => sum + stock.stock, 0);

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Producto recuperado',
        body: {
          product: { ...product, totalStock, prices, priceDetails },
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Products - GET ONE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const create = asyncHandler(
  async (req: Request<unknown, unknown, CreateProductType>, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      // Insert a product
      const product = await prisma.products.create({ data });
      const { id } = product;

      // Get warehouses ids
      const warehouses = await prisma.warehouses.findMany({ select: { id: true } });
      const warehouseIds = warehouses.map((warehouse) => warehouse.id);

      // Create stocks array
      const stocks = warehouseIds.map((whId) => ({ productId: id, warehouseId: whId }));

      // Insert stocks
      await prisma.stocks.createMany({ data: stocks });

      // Get pricelists ids
      const pricelists = await prisma.pricelists.findMany({ select: { id: true } });
      const pricelistsIds = pricelists.map((warehouse) => warehouse.id);

      // Create prices array
      const prices = pricelistsIds.map((prId) => ({ productId: id, pricelistId: prId }));

      // Insert prices
      await prisma.prices.createMany({ data: prices });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Producto creado',
        body: {
          product,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Products - CREATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const update = asyncHandler(
  async (req: Request<{ id?: number }, unknown, UpdateProductType>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, description, status, allownegativestock, categoryId, unitId } = req.body;

      const product = await prisma.products.update({
        where: { id: Number(id) },
        data: { name, description, status, allownegativestock, categoryId, unitId },
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Usuario actualizado',
        body: {
          product,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Products - UPDATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const remove = asyncHandler(
  async (req: Request<{ id?: number }, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      await prisma.stocks.deleteMany({ where: { productId: Number(id) } });

      await prisma.prices.deleteMany({ where: { productId: Number(id) } });

      const product = await prisma.products.delete({
        where: { id: Number(id) },
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Producto eliminado',
        body: {
          product,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Products - DELETE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);
