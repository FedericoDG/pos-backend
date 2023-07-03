import { NextFunction, Response, Request } from 'express';
import { CashMovements, PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';

import { CreateCashMovementsType } from 'src/schemas/cashMovement.schema';

const prisma = new PrismaClient();

export const getAll = asyncHandler(
  async (_req: Request<unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const cashMovements = await prisma.cashMovements.findMany({
        include: { client: true, user: { include: { role: true } }, warehouse: true, paymentMethod: true },
        orderBy: [{ id: 'desc' }],
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Cajas recuperadas',
        body: {
          cashMovements,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Cash Movements - GET ALL]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const getById = asyncHandler(
  async (req: Request<{ id?: number }, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const cashMovement = await prisma.cashMovements.findFirst({
        where: { id: Number(id) },
        include: { client: true, user: { include: { role: true } }, warehouse: true, paymentMethod: true },
        orderBy: [{ id: 'desc' }],
      });

      const cashMovementDetails = await prisma.cashMovementsDetails.findMany({
        where: { cashMovementId: Number(id) },
        include: { product: { include: { category: true, unit: true } } },
        orderBy: [{ id: 'desc' }],
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Caja recuperada',
        body: {
          cashMovement: { ...cashMovement, cashMovementDetails },
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Cash Movement - GET ONE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const create = asyncHandler(
  async (req: Request<unknown, unknown, CreateCashMovementsType>, res: Response, next: NextFunction) => {
    try {
      const { warehouseId, clientId, paymentMethodId, discount, recharge, cart } = req.body;
      const { id: userId } = req.user;

      const cashRegister = await prisma.cashRegisters.findFirst({ orderBy: [{ id: 'desc' }] });

      const productsIds = cart.map((item) => item.productId);
      const subtotal = cart.reduce((acc, item) => acc + item.quantity * item.price, 0);
      const cashRegisterId = cashRegister?.id || 1;
      const cashRegisterFinalBalance = cashRegister?.finalBalance || 0;

      // Update Cash Register
      await prisma.cashRegisters.update({
        where: { id: cashRegisterId },
        data: { finalBalance: cashRegisterFinalBalance + subtotal + recharge - discount },
      });

      // Create Cash Movement
      const cashMovement = await prisma.cashMovements.create({
        data: {
          cashRegisterId,
          subtotal: subtotal,
          recharge,
          discount,
          total: subtotal + recharge - discount,
          warehouseId,
          clientId,
          userId,
          paymentMethodId,
        },
      });

      // Create Cash Movement Details
      const cashMovementId = cashMovement.id;

      const cartWithcashMovementId = cart.map((item) => ({ ...item, cashMovementId }));

      await prisma.cashMovementsDetails.createMany({ data: cartWithcashMovementId });

      // Stock Origin
      const stocks = await prisma.stocks.findMany({
        where: { productId: { in: productsIds }, warehouseId },
        orderBy: [{ createdAt: 'asc' }],
      });

      const uniqueStocksOrigin = stocks.reduce((acc: any[], current) => {
        const existingStock = acc.find((stock) => stock.productId === current.productId);

        if (!existingStock) {
          acc.push(current);
        }

        return acc;
      }, []);

      uniqueStocksOrigin.sort((a, b) => a.productId - b.productId);
      cart.sort((a, b) => a.productId - b.productId);

      const newStock = uniqueStocksOrigin.map((item, idx) => {
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
        message: 'Caja creada',
        body: {
          cashMovement,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Cash Registers - CREATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

//TODO Undo Cash Movement
