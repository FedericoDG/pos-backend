import { NextFunction, Response, Request } from 'express';
import createHttpError from 'http-errors';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';

import { CreateUnitType, UpdateUnitType } from '../schemas/unit.schema';
import { DateTime } from 'luxon';
import prisma from '../helpers/prisma';

export const getAll = asyncHandler(
  async (_req: Request<unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      // Only warehouses (not drivers)
      const warehouses = await prisma.warehouses.findMany({ where: { driver: 0 }, select: { id: true } });
      const ids = warehouses.map((el) => el.id);
      const stocks = await prisma.stocks.findMany({
        where: {
          warehouseId: { in: ids },
        },
        include: {
          products: {
            include: {
              category: true,
              unit: true,
              stocks: {
                select: {
                  id: true,
                  productId: true,
                  warehouseId: true,
                  stock: true,
                  prevstock: true,
                  prevdate: true,
                  createdAt: true,
                  updatedAt: true,
                },
                orderBy: [{ id: 'desc' }],
              },
              costs: {
                select: { price: true, productId: true, createdAt: true, updatedAt: true },
                take: 1,
                orderBy: [{ id: 'desc' }],
              },
            },
          },
        },
        orderBy: [{ updatedAt: 'desc' }],
      });

      const mergedStocks = stocks.reduce((acc: any, curr) => {
        const existingStock = acc.find((item) => item.productId === curr.productId);
        if (existingStock) {
          existingStock.stock += curr.stock;
        } else {
          acc.push(curr);
        }
        return acc;
      }, []);

      const uniqueStocksArray: any[] = [];

      for (const stock of mergedStocks) {
        const uniqueStocks = {};

        for (const stockItem of stock.products.stocks) {
          const warehouseId = stockItem.warehouseId;

          if (!uniqueStocks[warehouseId]) {
            uniqueStocks[warehouseId] = stockItem;
          } else {
            uniqueStocks[warehouseId].stock += stockItem.stock - stockItem.stock;
          }
        }

        const updatedStocksObject = {
          ...stock,
          products: {
            ...stock.products,
            stocks: Object.values(uniqueStocks),
          },
        };

        uniqueStocksArray.push(updatedStocksObject);
      }

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Unidades recuperados',
        body: {
          stocks: uniqueStocksArray,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Stocks - GET ALL]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const getByWarehouseId = asyncHandler(
  async (req: Request<{ id?: number }, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const stocks = await prisma.stocks.findMany({
        where: { warehouseId: Number(id) },
        include: {
          products: {
            include: {
              category: true,
              unit: true,
              stocks: {
                where: { warehouseId: Number(id) },
                select: {
                  id: true,
                  productId: true,
                  warehouseId: true,
                  stock: true,
                  prevstock: true,
                  prevdate: true,
                  createdAt: true,
                  updatedAt: true,
                },
                orderBy: [{ id: 'desc' }],
              },
              costs: {
                select: { price: true, productId: true, createdAt: true, updatedAt: true },
                take: 1,
                orderBy: [{ id: 'desc' }],
              },
            },
          },
        },
        orderBy: [{ updatedAt: 'desc' }],
      });

      const mergedStocks = stocks.reduce((acc: any, curr) => {
        const existingStock = acc.find((item) => item.productId === curr.productId);
        if (existingStock) {
          existingStock.stock += curr.stock;
        } else {
          acc.push(curr);
        }
        return acc;
      }, []);

      const uniqueStocksArray: any[] = [];

      for (const stock of mergedStocks) {
        const uniqueStocks = {};

        for (const stockItem of stock.products.stocks) {
          const warehouseId = stockItem.warehouseId;

          if (!uniqueStocks[warehouseId]) {
            uniqueStocks[warehouseId] = stockItem;
          } else {
            uniqueStocks[warehouseId].stock += stockItem.stock - stockItem.stock;
          }
        }

        const updatedStocksObject = {
          ...stock,
          products: {
            ...stock.products,
            stocks: Object.values(uniqueStocks),
          },
        };

        uniqueStocksArray.push(updatedStocksObject);
      }

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Unidades recuperados',
        body: {
          stocks: uniqueStocksArray,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Stocks - GET ALL]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const getByWarehouseIdAndProductId = asyncHandler(
  async (
    req: Request<{ id?: number }, unknown, { from; to; productId: number }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id: warehouseId } = req.params;
      const { from, to, productId } = req.body;

      const parsedFrom = new Date(from!.concat(' 00:00:00'));
      const parsedTo = new Date(to!.concat(' 23:59:59'));

      const stock = await prisma.stocksDetails.findMany({
        where: {
          productId: Number(productId),
          warehouseId: Number(warehouseId),
          createdAt: {
            gte: parsedFrom,
            lte: parsedTo,
          },
        },
        include: { movement: { include: { purchase: true, cashMovement: true, discharge: true, transfer: true } } },
        orderBy: [{ id: 'desc' }],
      });

      const desde = DateTime.fromJSDate(parsedFrom);
      const hasta = DateTime.fromJSDate(parsedTo);

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Unidades recuperadas',
        body: {
          from: parsedFrom,
          desde,
          to: parsedTo,
          hasta,
          stock,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Stocks - GET By WarehouseId and ProductId]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const create = asyncHandler(
  async (req: Request<unknown, unknown, CreateUnitType>, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const unit = await prisma.units.create({ data });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Unidad creada',
        body: {
          unit,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Units - CREATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const update = asyncHandler(
  async (req: Request<{ id?: number }, unknown, UpdateUnitType>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { code, name } = req.body;

      const unit = await prisma.units.update({
        where: { id: Number(id) },
        data: { code, name },
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Unidad actualizada',
        body: {
          unit,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Units - UPDATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const remove = asyncHandler(
  async (req: Request<{ id?: number }, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const unit = await prisma.units.delete({
        where: { id: Number(id) },
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Unidad eliminada',
        body: {
          unit,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Units - DELETE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);
