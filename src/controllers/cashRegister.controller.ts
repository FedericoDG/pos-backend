/* eslint-disable no-prototype-builtins */
import { NextFunction, Response, Request } from 'express';
import { MovementType } from '@prisma/client';
import createHttpError from 'http-errors';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';

import {
  CreateCashRegisterType,
  UpdateCashRegisterByIdType,
  UpdateCashRegisterType,
} from '../schemas/cashRegister.schema';
import prisma from '../helpers/prisma';

export const getAll = asyncHandler(
  async (_req: Request<unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const cashRegisters = await prisma.cashRegisters.findMany({
        include: {
          user: { include: { role: true } },
        },
        orderBy: [{ openingDate: 'desc' }],
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

      const totDisc = cashRegister?.cashMovements.reduce((acc, curr) => acc + curr.discount, 0) || 0;
      const totDiscInd =
        cashRegister?.cashMovements.reduce(
          (acc, curr) =>
            acc + curr.cashMovementsDetails.reduce((acc, curr) => acc + curr.totalDiscount * (1 + curr.tax), 0),
          0,
        ) || 0;

      const uniques: any[] = [];
      cashRegister?.cashMovements.forEach((el) => {
        if (el.invoceTypeId !== 8) {
          el.cashMovementsDetails.forEach((elx) => uniques.push(elx));
        } else {
          el.cashMovementsDetails.forEach((elx) => {
            const fede = {
              ...elx,
              quantity: elx.quantity * -1,
            };
            uniques.push(fede);
          });
        }
      });

      /*   const uniques: any[] = [];
      cashRegister?.cashMovements.forEach((el) => {
        el.cashMovementsDetails.forEach((elx) => uniques.push(elx));
      }); */

      const uniqueValues = Object.values(
        uniques.reduce((acc: any, curr: any) => {
          if (acc.hasOwnProperty(curr.productId)) {
            acc[curr.productId] = { ...curr, quantity: acc[curr.productId].quantity + curr.quantity };
          } else {
            acc[curr.productId] = { ...curr, quantity: curr.quantity };
          }
          return acc;
        }, {}),
      );

      let uniqueValuesSorted = uniqueValues.sort((a: any, b: any) => {
        if (a.product.name > b.product.name) {
          return 1;
        }
        if (a.product.name < b.product.name) {
          return -1;
        }
        return 0;
      });

      uniqueValuesSorted = uniqueValuesSorted.filter((el: any) => el.quantity > 0);

      const incomes = cashRegister?.cashMovements.filter(
        (el) =>
          el.invoceTypeId === 1 ||
          el.invoceTypeId === 2 ||
          el.invoceTypeId === 3 ||
          el.invoceTypeId === 4 ||
          el.invoceTypeId === 9,
      );

      const outcomes = cashRegister?.cashMovements.filter(
        (el) =>
          el.invoceTypeId === 5 ||
          el.invoceTypeId === 6 ||
          el.invoceTypeId === 7 ||
          el.invoceTypeId === 8 ||
          el.invoceTypeId === 10,
      );

      const cash =
        incomes
          ?.map((movement) => movement.paymentMethodDetails.filter((el) => el.paymentMethodId === 1))
          .flat()
          .reduce((acc, el) => acc + el.amount, 0) || 0;

      const debit =
        incomes
          ?.map((movement) => movement.paymentMethodDetails.filter((el) => el.paymentMethodId === 2))
          .flat()
          .reduce((acc, el) => acc + el.amount, 0) || 0;
      const credit =
        incomes
          ?.map((movement) => movement.paymentMethodDetails.filter((el) => el.paymentMethodId === 3))
          .flat()
          .reduce((acc, el) => acc + el.amount, 0) || 0;
      const transfer =
        incomes
          ?.map((movement) => movement.paymentMethodDetails.filter((el) => el.paymentMethodId === 4))
          .flat()
          .reduce((acc, el) => acc + el.amount, 0) || 0;
      const mercadoPago =
        incomes
          ?.map((movement) => movement.paymentMethodDetails.filter((el) => el.paymentMethodId === 5))
          .flat()
          .reduce((acc, el) => acc + el.amount, 0) || 0;
      const currentAccount =
        incomes
          ?.map((movement) => movement.paymentMethodDetails.filter((el) => el.paymentMethodId === 6))
          .flat()
          .reduce((acc, el) => acc + el.amount, 0) || 0;

      const cashOut =
        outcomes
          ?.map((movement) => movement.paymentMethodDetails.filter((el) => el.paymentMethodId === 1))
          .flat()
          .reduce((acc, el) => acc + el.amount, 0) || 0;

      const debitOut =
        outcomes
          ?.map((movement) => movement.paymentMethodDetails.filter((el) => el.paymentMethodId === 2))
          .flat()
          .reduce((acc, el) => acc + el.amount, 0) || 0;
      const creditOut =
        outcomes
          ?.map((movement) => movement.paymentMethodDetails.filter((el) => el.paymentMethodId === 3))
          .flat()
          .reduce((acc, el) => acc + el.amount, 0) || 0;
      const transferOut =
        outcomes
          ?.map((movement) => movement.paymentMethodDetails.filter((el) => el.paymentMethodId === 4))
          .flat()
          .reduce((acc, el) => acc + el.amount, 0) || 0;
      const mercadoPagoOut =
        outcomes
          ?.map((movement) => movement.paymentMethodDetails.filter((el) => el.paymentMethodId === 5))
          .flat()
          .reduce((acc, el) => acc + el.amount, 0) || 0;

      const currentAccountOut =
        outcomes
          ?.map((movement) => movement.paymentMethodDetails.filter((el) => el.paymentMethodId === 6))
          .flat()
          .reduce((acc, el) => acc + el.amount, 0) || 0;

      const recharges = incomes?.reduce((acc, el) => acc + el.recharge, 0) || 0;
      const otherTributes = incomes?.reduce((acc, el) => acc + el.otherTributes, 0) || 0;

      const mappedOutcomes = outcomes?.map((movement) => ({
        total: movement.total,
        recharge: movement.recharge,
        discount: movement.discount,
      }));

      const creditNotes = mappedOutcomes?.reduce((acc, el) => acc + el.total, 0) || 0;

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Caja recuperada',
        body: {
          cashRegister: {
            ...cashRegister,
            uniques: uniqueValuesSorted,
            total:
              cash +
              debit +
              credit +
              transfer +
              mercadoPago +
              currentAccount +
              recharges +
              otherTributes -
              totDisc -
              totDiscInd +
              creditNotes,
            sales: cash + debit + credit + transfer + mercadoPago + currentAccount,
            creditNotes,
            cash: cash - cashOut,
            debit: debit - debitOut,
            credit: credit - creditOut,
            transfer: transfer - transferOut,
            mercadoPago: mercadoPago - mercadoPagoOut,
            currentAccount: currentAccount - currentAccountOut,
            recharges,
            otherTributes,
            discounts: totDisc + totDiscInd,
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

        // Create Balance
        const movement = await prisma.movements.create({
          data: {
            amount: cost,
            type: MovementType.OUT,
            concept: 'Baja/Pérdida',
            paymentMethodId: 1,
            userId: Number(userId),
            dischargeId: id,
          },
        });

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

        // Stock Details
        const stockDetails = newStock.map((item) => ({
          productId: item.productId,
          warehouseId: item.warehouseId,
          stock: item.stock,
          movementId: movement.id,
        }));

        await prisma.stocksDetails.createMany({ data: stockDetails });
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

      // Create Balance
      const movement = await prisma.movements.create({
        data: {
          amount: 0,
          type: MovementType.TRANSFER_OUT,
          concept: 'Transferencia enviada',
          paymentMethodId: 1,
          userId: Number(userId),
          transferId: transfer.id,
        },
      });

      // Stock Details Origin
      const stockDetailsOrigin = newStockOrigin.map((item) => ({
        productId: item.productId,
        warehouseId: item.warehouseId,
        stock: item.stock,
        movementId: movement.id,
      }));

      const stocksDestination = await prisma.stocks.findMany({
        where: { productId: { in: productsIds2 }, warehouseId: warehouseDestinationId },
        orderBy: [{ createdAt: 'asc' }],
      });

      await prisma.stocksDetails.createMany({ data: stockDetailsOrigin });

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

      // Create Balance
      const movement2 = await prisma.movements.create({
        data: {
          amount: 0,
          type: MovementType.TRANSFER_IN,
          concept: 'Transferencia recibida',
          paymentMethodId: 1,
          userId: Number(userId),
          transferId: transfer.id,
        },
      });

      // Stock Details Destination
      const stockDetailsDestination = newStockDestination.map((item) => ({
        productId: item.productId,
        warehouseId: item.warehouseId,
        stock: item.stock,
        movementId: movement2.id,
      }));

      await prisma.stocksDetails.createMany({ data: stockDetailsDestination });

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

export const getCurrentAccountDetails = asyncHandler(
  async (req: Request<{ id?: number }, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const currentAccountDetails = await prisma.currentAccountDetails.findMany({
        where: {
          cashRegisterId: Number(id),
          type: 'PAYMENT',
          details: { not: 'Devolución Nota de Crédito' },
        },
        include: {
          paymentMethod: true,
          cashRegister: {
            include: { user: { include: { role: true } } },
          },
          currentAccount: {
            include: { client: { include: { identification: true } } },
          },
        },
      });

      const transformed = {
        currentAccountDetails: currentAccountDetails.map((detail) => ({
          ...detail,
          client: detail.currentAccount.client,
        })),
      };

      const details = transformed.currentAccountDetails;

      const paymentResume = details.reduce((acc, detail) => {
        const code = detail.paymentMethod!.code;
        if (!acc[code]) {
          acc[code] = 0;
        }
        acc[code] += detail.amount;
        return acc;
      }, {});

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Caja recuperada',
        body: {
          paymentResume,
          details,
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
