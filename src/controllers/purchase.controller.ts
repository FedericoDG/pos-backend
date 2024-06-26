import { NextFunction, Response, Request } from 'express';
import { MovementType } from '@prisma/client';
import createHttpError from 'http-errors';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';

import { CreatePurchaseType } from '../schemas/purchase.schema';
import prisma from '../helpers/prisma';

export const getAll = asyncHandler(
  async (_req: Request<unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const purchases = await prisma.purchases.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              lastname: true,
              email: true,
              roleId: true,
              createdAt: true,
              updatedAt: true,
              role: true,
            },
          },
          warehouse: true,
          supplier: true,
          purchaseDetails: { include: { product: { include: { category: true, unit: true } } } },
        },
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Compras recuperadas',
        body: {
          purchases,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Purchases - GET ALL]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const getById = asyncHandler(
  async (req: Request<{ id?: number }, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const purchase = await prisma.purchases.findFirst({
        where: { id: Number(id) },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              lastname: true,
              email: true,
              roleId: true,
              createdAt: true,
              updatedAt: true,
              role: true,
            },
          },
          warehouse: true,
          supplier: true,
          purchaseDetails: { include: { product: { include: { category: true, unit: true } } } },
        },
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Compra recuperada',
        body: {
          purchase,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Purchases - GET ONE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

/* export const create = asyncHandler(
  async (req: Request<unknown, unknown, CreatePurchaseType>, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const { id: userId } = req.user;

      const { cart, ...rest } = data;

      // Purchase
      const purchase = await prisma.purchases.create({ data: { ...rest, userId } });

      // Purchase Details
      const cartWithPurchaseId = cart.map((el) => ({ ...el, purchaseId: purchase.id }));
      await prisma.purchaseDetails.createMany({ data: cartWithPurchaseId });

      // Create Balance
      const movement = await prisma.movements.create({
        data: {
          amount: rest.total,
          type: MovementType.OUT,
          concept: 'Compra',
          paymentMethodId: 1,
          userId,
          purchaseId: purchase.id,
        },
      });

      // Update Costs
      const costs = cart.filter((el) => el.price !== 0).map((el) => ({ productId: el.productId, price: el.price }));
      await prisma.costs.createMany({ data: costs });

      // Stock
      const productsIds = cart.map((item) => item.productId);
      const stocks = await prisma.stocks.findMany({
        where: { productId: { in: productsIds }, warehouseId: rest.warehouseId },
        orderBy: [{ createdAt: 'asc' }],
      });

      const uniqueStocks = stocks.reduce((acc: any[], current) => {
        const existingStock = acc.find((stock) => stock.productId === current.productId);

        if (!existingStock) {
          acc.push(current);
        }

        return acc;
      }, []);

      uniqueStocks.sort((a, b) => a.productId - b.productId);
      cart.sort((a, b) => a.productId - b.productId);

      const newStock = uniqueStocks.map((item, idx) => {
        return {
          id: item.id,
          productId: item.productId,
          warehouseId: rest.warehouseId,
          stock: item.stock + cart[idx].quantity,
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

      // Stock Details
      const stockDetails = newStock.map((item) => ({
        productId: item.productId,
        warehouseId: item.warehouseId,
        stock: item.stock,
        movementId: movement.id,
      }));

      await prisma.stocksDetails.createMany({ data: stockDetails });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Compra creada',
        body: {
          purchase,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Purchases - CREATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
); */

export const create = asyncHandler(
  async (req: Request<unknown, unknown, CreatePurchaseType>, res: Response, next: NextFunction) => {
    try {
      await createPurchase(req.body, req.user.id);

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Compra creada',
        body: {
          //purchase,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Purchases - CREATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

async function createPurchase(data: CreatePurchaseType, userId: number) {
  const transaction = await prisma.$transaction(async (tx) => {
    const { cart, ...rest } = data;
    // Purchase
    const purchase = await tx.purchases.create({ data: { ...rest, userId } });

    // throw new Error('Error');

    // Purchase Details
    const cartWithPurchaseId = cart.map((el) => ({ ...el, purchaseId: purchase.id }));
    await tx.purchaseDetails.createMany({ data: cartWithPurchaseId });

    // Create Balance
    const movement = await tx.movements.create({
      data: {
        amount: rest.total,
        type: MovementType.OUT,
        concept: 'Compra',
        paymentMethodId: 1,
        userId,
        purchaseId: purchase.id,
      },
    });

    // Update Costs
    const costs = cart.filter((el) => el.price !== 0).map((el) => ({ productId: el.productId, price: el.price }));
    await tx.costs.createMany({ data: costs });

    // Stock
    const productsIds = cart.map((item) => item.productId);
    const stocks = await tx.stocks.findMany({
      where: { productId: { in: productsIds }, warehouseId: rest.warehouseId },
      orderBy: [{ createdAt: 'asc' }],
    });

    const uniqueStocks = stocks.reduce((acc: any[], current) => {
      const existingStock = acc.find((stock) => stock.productId === current.productId);

      if (!existingStock) {
        acc.push(current);
      }

      return acc;
    }, []);

    uniqueStocks.sort((a, b) => a.productId - b.productId);
    cart.sort((a, b) => a.productId - b.productId);

    const newStock = uniqueStocks.map((item, idx) => {
      return {
        id: item.id,
        productId: item.productId,
        warehouseId: rest.warehouseId,
        stock: item.stock + cart[idx].quantity,
        prevstock: item.stock,
        prevdate: item.createdAt,
      };
    });

    await Promise.all(
      newStock.map(
        async (el) =>
          await tx.stocks.update({
            where: { id: el.id },
            data: { ...el },
          }),
      ),
    );

    // Stock Details
    const stockDetails = newStock.map((item) => ({
      productId: item.productId,
      warehouseId: item.warehouseId,
      stock: item.stock,
      movementId: movement.id,
    }));

    await tx.stocksDetails.createMany({ data: stockDetails });
  });

  return transaction;

  // await transaction.$commit();
}
