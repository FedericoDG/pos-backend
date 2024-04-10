import { NextFunction, Response, Request } from 'express';
import { MovementType, Prices } from '@prisma/client';
import createHttpError from 'http-errors';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';

import { CreateProductType, UpdateProductType } from '../schemas/product.schema';

import prisma from '../helpers/prisma';

export const getAll = asyncHandler(
  async (req: Request<unknown, unknown, unknown, { nostock?: string }>, res: Response, next: NextFunction) => {
    try {
      const { nostock } = req.query;

      if (nostock) {
        const products = await prisma.products.findMany({
          include: {
            unit: true,
            category: true,
            ivaCondition: true,
            costs: true,
          },
          orderBy: [
            {
              updatedAt: 'desc',
            },
          ],
        });
        return endpointResponse({
          res,
          code: 200,
          status: true,
          message: 'Productos recuperados',
          body: {
            products,
          },
        });
      }

      const products = await prisma.products.findMany({
        orderBy: [
          {
            updatedAt: 'desc',
          },
        ],
        include: {
          unit: true,
          category: true,
          ivaCondition: { select: { id: true, code: true, description: true, tax: true } },
          costs: { orderBy: [{ id: 'desc' }], take: 1 },
          stocks: { include: { warehouse: true }, orderBy: [{ id: 'desc' }] },
        },
      });

      /*  const productsWithTotalStock = products.map((product) => {
        const totalStock = product.stocks.reduce((sum, stock) => {
          return sum + stock.stock;
        }, 0);

        return {
          ...product,
          totalStock,
        };
      }); */

      const productsWithTotalStock2 = products.map((product) => {
        const warehouseStocks = product.stocks.reduce((acc, stock) => {
          const { warehouseId } = stock;
          if (!acc[warehouseId]) {
            acc[warehouseId] = stock;
          } else {
            acc[warehouseId].stock += stock.stock;
          }
          return acc;
        }, {});

        const mergedStocks: any[] = Object.values(warehouseStocks);

        const totalStock = mergedStocks.reduce((sum, stock) => sum + stock.stock, 0);

        return {
          ...product,
          stocks: mergedStocks,
          totalStock,
        };
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Productos recuperados',
        body: {
          products: productsWithTotalStock2,
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
          unit: true,
          category: true,
          ivaCondition: true,
          costs: { orderBy: [{ id: 'desc' }] },
          /*  costs: { orderBy: [{ id: 'desc' }], take: 1 }, */
          stocks: { include: { warehouse: true }, orderBy: [{ id: 'desc' }] },
        },
      });

      const uniqueStocks = product?.stocks.reduce((acc, stock) => {
        const { warehouseId } = stock;
        if (!acc[warehouseId]) {
          acc[warehouseId] = stock;
        }
        return acc;
      }, {});

      const mergedStocks = Object.values(uniqueStocks!);

      const updatedProduct = {
        ...product,
        stocks: mergedStocks,
      };

      const rawIds = await prisma.pricelists.findMany({ select: { id: true } });
      const ids = rawIds.map((el) => el.id).sort((a, b) => a - b);

      const priceDetails: Prices[][] = [];
      const prices: Prices[] = [];
      for (const idx of ids) {
        const price = await prisma.prices.findMany({
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

        if (price.length > 0) {
          const filteredPrice = price.filter((el) => el.price >= 0);
          if (filteredPrice.length > 0) {
            prices.push(price[0]);
            priceDetails.push(price.sort((a, b) => a.id - b.id));
          }
        }
      }

      const totalStock = product?.stocks.reduce((sum, stock) => sum + stock.stock, 0);

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Producto recuperado',
        body: {
          product: { ...updatedProduct, totalStock, prices, priceDetails },
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
      const { id: userId } = req.user;

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

      // Create cost
      await prisma.costs.create({ data: { productId: id, price: 0 } });

      // Create Balance
      const movement = await prisma.movements.create({
        data: {
          amount: 0,
          type: MovementType.CREATION,
          concept: 'Creación',
          paymentMethodId: 1,
          userId,
        },
      });

      // Stock Details
      const stocksDetails = warehouseIds.map((whId) => ({ productId: id, warehouseId: whId, movementId: movement.id }));
      await prisma.stocksDetails.createMany({ data: stocksDetails });

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
      const {
        name,
        code,
        barcode,
        description,
        status,
        allownegativestock,
        categoryId,
        unitId,
        ivaConditionId,
        alertlowstock,
        lowstock,
      } = req.body;

      const product = await prisma.products.update({
        where: { id: Number(id) },
        data: {
          name,
          code,
          barcode,
          description,
          status,
          allownegativestock,
          categoryId,
          unitId,
          ivaConditionId,
          alertlowstock,
          lowstock,
        },
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Producto actualizado',
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

      const product = await prisma.products.delete({
        where: { id: Number(id) },
      });

      await prisma.stocks.deleteMany({ where: { productId: Number(id) } });

      await prisma.prices.deleteMany({ where: { productId: Number(id) } });

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
