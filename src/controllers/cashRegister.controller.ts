import { NextFunction, Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';

import {
  CreateCashRegisterType,
  UpdateCashRegisterByIdType,
  UpdateCashRegisterType,
} from 'src/schemas/cashRegister.schema';

const prisma = new PrismaClient();

export const getAll = asyncHandler(
  async (_req: Request<unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const cashRegisters = await prisma.cashRegisters.findMany({
        include: {
          user: { include: { role: true } },
          /*   cashMovements: {
            include: {
              user: { include: { role: true } },
              cashMovementsDetails: {
                include: { product: { include: { category: true, unit: true } } },
                orderBy: [{ id: 'desc' }],
              },
            },
            orderBy: [{ id: 'desc' }],
          }, */
        },
        orderBy: [{ closingDate: 'asc' }],
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Cajas recuperadas',
        body: {
          cashRegisters,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Cash Registers - GET ALL]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const getById = asyncHandler(
  async (req: Request<{ id?: number }, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const cashRegister = await prisma.cashRegisters.findFirst({
        where: { id: Number(id) },
        include: {
          user: { include: { role: true } },
          cashMovements: {
            include: {
              client: true,
              warehouse: true,
              paymentMethodDetails: { include: { paymentMethod: true } },
              otherTributesDetails: { include: { otherTribute: true } },
              cashMovementsDetails: {
                include: { product: { include: { category: true, unit: true, ivaCondition: true } } },
                orderBy: [{ id: 'desc' }],
              },
            },
            orderBy: [{ id: 'desc' }],
          },
        },
        orderBy: [{ id: 'desc' }],
      });

      const cash =
        cashRegister?.cashMovements
          .map((movement) => movement.paymentMethodDetails.filter((el) => el.paymentMethodId === 1))
          .flat()
          .reduce((acc, el) => acc + el.amount, 0) || 0;
      const debit =
        cashRegister?.cashMovements
          .map((movement) => movement.paymentMethodDetails.filter((el) => el.paymentMethodId === 2))
          .flat()
          .reduce((acc, el) => acc + el.amount, 0) || 0;
      const credit =
        cashRegister?.cashMovements
          .map((movement) => movement.paymentMethodDetails.filter((el) => el.paymentMethodId === 3))
          .flat()
          .reduce((acc, el) => acc + el.amount, 0) || 0;
      const transfer =
        cashRegister?.cashMovements
          .map((movement) => movement.paymentMethodDetails.filter((el) => el.paymentMethodId === 4))
          .flat()
          .reduce((acc, el) => acc + el.amount, 0) || 0;
      const mercadoPago =
        cashRegister?.cashMovements
          .map((movement) => movement.paymentMethodDetails.filter((el) => el.paymentMethodId === 5))
          .flat()
          .reduce((acc, el) => acc + el.amount, 0) || 0;
      const discounts = cashRegister?.cashMovements.reduce((acc, el) => acc + el.discount, 0) || 0;
      const recharges = cashRegister?.cashMovements.reduce((acc, el) => acc + el.recharge, 0) || 0;
      const otherTributes = cashRegister?.cashMovements.reduce((acc, el) => acc + el.otherTributes, 0) || 0;

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Caja recuperada',
        body: {
          cashRegister: {
            ...cashRegister,
            total: cash + debit + credit + transfer + mercadoPago + recharges + otherTributes - discounts,
            cash,
            debit,
            credit,
            transfer,
            mercadoPago,
            discounts,
            recharges,
            otherTributes,
          },
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Cash Register - GET ONE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const status = asyncHandler(
  async (req: Request<unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const { id: userId } = req.user;
      const cashRegister = await prisma.cashRegisters.findFirst({
        where: { userId },
        include: { user: true },
        orderBy: [{ id: 'desc' }],
      });

      if (!cashRegister || cashRegister?.closingDate) {
        endpointResponse({
          res,
          code: 200,
          status: true,
          message: 'Estado de la Caja',
          body: {
            cashRegister: {
              ...cashRegister,
              isOpen: false,
            },
          },
        });
      } else {
        endpointResponse({
          res,
          code: 200,
          status: true,
          message: 'Estado de la Caja',
          body: {
            cashRegister: {
              ...cashRegister,
              isOpen: true,
            },
          },
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Cash Register - GET ONE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const statusByUserId = asyncHandler(
  async (req: Request<{ id?: number }, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const cashRegister = await prisma.cashRegisters.findFirst({
        where: { userId: Number(id) },
        include: { user: true },
        orderBy: [{ id: 'desc' }],
      });

      if (!cashRegister || cashRegister?.closingDate) {
        endpointResponse({
          res,
          code: 200,
          status: true,
          message: 'Estado de la Caja',
          body: {
            cashRegister: {
              ...cashRegister,
              isOpen: false,
            },
          },
        });
      } else {
        endpointResponse({
          res,
          code: 200,
          status: true,
          message: 'Estado de la Caja',
          body: {
            cashRegister: {
              ...cashRegister,
              isOpen: true,
            },
          },
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Cash Register - GET ONE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const open = asyncHandler(
  async (req: Request<unknown, unknown, CreateCashRegisterType>, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const { id: userId } = req.user;

      const cashRegister = await prisma.cashRegisters.create({ data: { ...data, finalBalance: 0, userId } });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Caja creada',
        body: {
          cashRegister,
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

export const close = asyncHandler(
  async (req: Request<unknown, unknown, UpdateCashRegisterType>, res: Response, next: NextFunction) => {
    try {
      const { id: userId } = req.user;
      const data = req.body;

      const actualCashRegister = await prisma.cashRegisters.findFirst({ where: { userId }, orderBy: [{ id: 'desc' }] });

      const cashRegister = await prisma.cashRegisters.update({
        where: { id: Number(actualCashRegister?.id) },
        data,
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Caja cerrada',
        body: {
          cashRegister,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[CASHREGISTERS - CLOSE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const closeById = asyncHandler(
  async (req: Request<{ id?: number }, unknown, UpdateCashRegisterByIdType>, res: Response, next: NextFunction) => {
    try {
      const { warehouseId, cart, warehouseDestinationId, closingDate } = req.body;
      const { id: userId } = req.params;

      // DISCHARGE
      if (cart.length > 0) {
        cart.sort((a, b) => a.productId - b.productId);
        const cost = cart.reduce((acc, item) => acc + Number(item.quantity) * Number(item.cost), 0);
        const { id } = await prisma.discharges.create({ data: { warehouseId, userId: Number(userId), cost } });
        await prisma.movements.create({ data: { amount: cost, type: 'OUT', userId: Number(userId) } });
        const productsIds = cart.map((item) => item.productId).sort();
        const cartWithWarehouseId = cart
          .map((item) => ({
            dischargeId: id,
            cost: item.cost,
            reasonId: item.reasonId,
            productId: item.productId,
            quantity: item.quantity,
            info: item.info,
          }))
          .sort((a, b) => a.productId - b.productId);
        await prisma.dischargeDetails.createMany({ data: cartWithWarehouseId });
        const stocks = await prisma.stocks.findMany({
          where: { productId: { in: productsIds }, warehouseId: warehouseId },
          orderBy: [{ id: 'asc' }],
        });

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
      }

      // TRANSFER
      const tranferStocks = await prisma.stocks.findMany({ where: { warehouseId, stock: { gt: 0 } } });
      const cart2 = tranferStocks.map((el) => ({ productId: el.productId, quantity: el.stock }));

      const transfer = await prisma.transfer.create({
        data: { warehouseOriginId: warehouseId, warehouseDestinationId, userId: Number(userId) },
      });
      const cartWithTransferId = cart2.map((el) => ({ ...el, transferId: transfer.id }));
      await prisma.transferDetails.createMany({ data: cartWithTransferId });

      const productsIds2 = cart2.map((item) => item.productId);
      const stocksOrigin = await prisma.stocks.findMany({
        where: { productId: { in: productsIds2 }, warehouseId: warehouseId },
        orderBy: [{ createdAt: 'asc' }],
      });

      const uniqueStocksOrigin = stocksOrigin.reduce((acc: any[], current) => {
        const existingStock = acc.find((stock) => stock.productId === current.productId);

        if (!existingStock) {
          acc.push(current);
        }

        return acc;
      }, []);

      uniqueStocksOrigin.sort((a, b) => a.productId - b.productId);
      cart2.sort((a, b) => a.productId - b.productId);
      const newStockOrigin = uniqueStocksOrigin.map((item, idx) => {
        return {
          id: item.id,
          productId: item.productId,
          warehouseId,
          stock: item.stock - cart2[idx].quantity,
          prevstock: item.stock,
          prevdate: item.createdAt,
        };
      });

      await Promise.all(
        newStockOrigin.map(
          async (el) =>
            await prisma.stocks.update({
              where: { id: el.id },
              data: { ...el },
            }),
        ),
      );

      const stocksDestination = await prisma.stocks.findMany({
        where: { productId: { in: productsIds2 }, warehouseId: warehouseDestinationId },
        orderBy: [{ createdAt: 'asc' }],
      });

      const uniqueStocksDestination = stocksDestination.reduce((acc: any[], current) => {
        const existingStock = acc.find((stock) => stock.productId === current.productId);

        if (!existingStock) {
          acc.push(current);
        }

        return acc;
      }, []);

      uniqueStocksDestination.sort((a, b) => a.productId - b.productId);

      const newStockDestination = uniqueStocksDestination.map((item, idx) => {
        return {
          id: item.id,
          productId: item.productId,
          warehouseId: warehouseDestinationId,
          stock: item.stock + cart2[idx].quantity,
          prevstock: item.stock,
          prevdate: item.createdAt,
        };
      });

      await Promise.all(
        newStockDestination.map(
          async (el) =>
            await prisma.stocks.update({
              where: { id: el.id },
              data: { ...el },
            }),
        ),
      );

      // CLOSE CASH REGISTER
      const actualCashRegister = await prisma.cashRegisters.findFirst({
        where: { userId: Number(userId) },
        orderBy: [{ id: 'desc' }],
      });
      const cashRegister = await prisma.cashRegisters.update({
        where: { id: Number(actualCashRegister?.id) },
        data: { closingDate },
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Caja cerrada',
        body: {
          cashRegister,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[CASHREGISTERS - CLOSE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);
