import { NextFunction, Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';

import { CreatePriceListType, UpdatePriceListType } from 'src/schemas/pricelist.schema';
import { getList } from '../helpers/getList';

const prisma = new PrismaClient();

interface Result {
  pricelists: {
    code: string;
    description: string | null;
  };
  products: {
    code: string;
    unit: {
      code: string;
      name: string;
    };
    category: {
      description: string | null;
      name: string;
    };
    name: string;
    barcode: string;
    stocks: {
      stock: number;
      warehouse: {
        code: string;
      };
    }[];
  };
  productId: number;
  price: number;
  pricelistId: number;
}

export const getAll = asyncHandler(
  async (_req: Request<unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const pricelists = await prisma.pricelists.findMany({
        orderBy: [
          {
            updatedAt: 'asc',
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
          warehouse: true,
        },
      });

      const list = getList(pricelist, stocks, 'products');

      const filteredList = {
        ...list,
        products: list.products?.filter((item: any) => item.price > 0),
      }; /* OJO */

      console.log(list);

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Lista de precio recuperada',
        body: {
          pricelist: filteredList,
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
          warehouse: true,
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

export const federico = asyncHandler(
  async (
    req: Request<unknown, unknown, unknown, { products?: any; pricelists?: any; warehouses?: any }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      let { products, pricelists, warehouses } = req.query;

      if (products) products = JSON.parse(products);
      if (pricelists) pricelists = JSON.parse(pricelists);
      if (warehouses) warehouses = JSON.parse(warehouses);

      const pricelist = await prisma.pricelists.findMany({
        where: {
          id: { in: pricelists },
        },
        select: {
          code: true,
          description: true,
          prices: {
            where: {
              /* price: { gt: 0 }, */
              productId: { in: products },
            },
            select: {
              price: true,
              productId: true,
              pricelistId: true,
              createdAt: true,
              pricelists: { select: { code: true, description: true } },
              products: {
                select: {
                  name: true,
                  code: true,
                  barcode: true,
                  status: true,
                  unit: { select: { code: true, name: true } },
                  category: { select: { name: true, description: true } },
                  stocks: {
                    where: { warehouseId: { in: warehouses } },
                    select: { stock: true, warehouse: { select: { code: true, description: true } } },
                  },
                },
              },
            },
            orderBy: [{ createdAt: 'desc' }],
          },
        },
      });

      // ESTO ESTÁ MEJOR
      /* const uniquePricelists = pricelist.map((pricelistItem) => {
        const uniquePrices: any = [];
        const priceMap = {};

        pricelistItem.prices.forEach((price) => {
          const key = `${price.productId}_${price.pricelistId}`;
          if (!priceMap[key]) {
            priceMap[key] = true;
            uniquePrices.push(price);
          }
        });

        return { ...pricelistItem, prices: uniquePrices };
      }); */

      const secondArray: Result[] = [];
      const uniqueCombinations = {};
      for (const pl of pricelist) {
        for (const price of pl.prices) {
          const key = `${price.productId}-${price.pricelistId}`;

          if (!uniqueCombinations[key]) {
            uniqueCombinations[key] = true;

            secondArray.push(price);
          }
        }
      }

      const organizedArray = {};
      for (const obj of secondArray) {
        const pricelistId = obj.pricelistId;

        if (!organizedArray[pricelistId]) {
          organizedArray[pricelistId] = [];
        }

        organizedArray[pricelistId].push(obj);
      }

      const result: any = Object.values(organizedArray);

      for (const arr of result as Array<any[]>) {
        for (const obj of arr) {
          const totalStock = obj.products.stocks.reduce(
            (acc: number, stock: { stock: number }) => acc + stock.stock,
            0,
          );
          const stocks = await prisma.stocks.findMany({
            where: { productId: Number(obj.productId) },
          });
          const totalStockPosta = stocks.reduce((acc, stock) => acc + stock.stock, 0);

          obj.totalStockPosta = totalStockPosta;
          obj.totalStock = totalStock;
        }
      }

      const pricelistsWithConsolidatedStocks = result.map((pricelist) => {
        const updatedPricelist = pricelist.map((item) => {
          const stocks = item.products.stocks;

          const stockByWarehouse = stocks.reduce((accumulator, currentStock) => {
            const { stock, warehouse } = currentStock;
            const { code } = warehouse;

            if (!accumulator[code]) {
              accumulator[code] = {
                stock: stock,
                warehouse: warehouse,
              };
            } else {
              accumulator[code].stock += stock;
            }

            return accumulator;
          }, {});

          const consolidatedStocks = Object.values(stockByWarehouse);

          return {
            ...item,
            products: {
              ...item.products,
              stocks: consolidatedStocks,
            },
          };
        });

        return updatedPricelist;
      });

      const filterA = 'A';

      pricelistsWithConsolidatedStocks.forEach((element) => {
        element.sort((a, b) => {
          if (filterA === 'A') {
            const categoryComparison = a.products.category.name.localeCompare(b.products.category.name);

            if (categoryComparison === 0) {
              return a.products.name.localeCompare(b.products.name);
            } else {
              return categoryComparison;
            }
          } else {
            const nameComparison = a.products.name.localeCompare(b.products.name);

            if (nameComparison === 0) {
              return a.products.category.name.localeCompare(b.products.category.name);
            } else {
              return nameComparison;
            }
          }
        });
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Lista de precio recuperada',
        body: {
          pricelists: pricelistsWithConsolidatedStocks,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[PriceLists - GET REPORT]: ${error.message}`);
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

      await prisma.prices.deleteMany({ where: { pricelistId: Number(id) } });

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
