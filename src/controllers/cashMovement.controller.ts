import { NextFunction, Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';

import { CreateCashMovementsType } from 'src/schemas/cashMovement.schema';

const prisma = new PrismaClient();

export const getAll = asyncHandler(
  async (_req: Request<unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const cashMovements = await prisma.cashMovements.findMany({
        include: { client: true, user: { include: { role: true } }, warehouse: true, paymentMethodDetails: true },
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
        include: {
          client: { include: { identification: true } },
          user: { include: { role: true } },
          warehouse: true,
          paymentMethodDetails: { include: { paymentMethod: true } },
          otherTributesDetails: { include: { otherTribute: true } },
        },
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
        message: 'Movimiento recuperado',
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
      const {
        warehouseId,
        clientId,
        discount,
        discountPercent,
        recharge,
        rechargePercent,
        cart,
        payments,
        info,
        invoceTypeId,
        otherTributes,
        iva,
      } = req.body;
      const { id: userId } = req.user;

      const cashRegister = await prisma.cashRegisters.findFirst({ where: { userId }, orderBy: [{ id: 'desc' }] });
      const settings = await prisma.settings.findFirst({ select: { invoceNumber: true } });
      const afip = await prisma.afip.findFirst({ select: { posNumber: true } });

      const productsIds = cart.map((item) => item.productId);
      const subtotalOtherTributes = otherTributes.reduce((acc, item) => acc + item.amount, 0);
      const subtotal = cart.reduce((acc, item) => acc + item.quantity * item.price * (1 + item.tax), 0);
      const cashRegisterId = cashRegister?.id || 1;
      const cashRegisterFinalBalance = cashRegister?.finalBalance || 0;
      const finalBalance = cashRegisterFinalBalance + subtotal + subtotalOtherTributes;

      // Update Cash Register
      await prisma.cashRegisters.update({
        where: { id: cashRegisterId },
        data: { finalBalance: finalBalance },
      });

      // Create Cash Movement
      const cashMovement = await prisma.cashMovements.create({
        data: {
          iva,
          cashRegisterId,
          subtotal: subtotal,
          discount,
          discountPercent,
          recharge,
          rechargePercent,
          otherTributes: subtotalOtherTributes,
          total: subtotal + subtotalOtherTributes,
          warehouseId,
          clientId,
          userId,
          posNumber: afip?.posNumber || 1,
          invoceTypeId,
          invoceNumber: settings?.invoceNumber || 0,
          info,
        },
      });

      // Create Cash Movement Details
      const cashMovementId = cashMovement.id;

      const cartWithcashMovementId = cart.map((item) => ({
        productId: item.productId,
        price: item.price,
        quantity: item.quantity,
        tax: item.tax,
        cashMovementId,
      }));

      await prisma.cashMovementsDetails.createMany({ data: cartWithcashMovementId });

      // Create Payments Details
      const reducedPayments = payments.reduce((accumulator, payment) => {
        const paymentMethodId = payment.paymentMethodId;
        if (!accumulator[paymentMethodId]) {
          accumulator[paymentMethodId] = {
            amount: 0,
            paymentMethodId: paymentMethodId,
          };
        }
        accumulator[paymentMethodId].amount += payment.amount;
        return accumulator;
      }, {});

      const reducedPaymentsArray: Array<{ amount: number; paymentMethodId: number }> = Object.values(reducedPayments);
      const mappedPayments = reducedPaymentsArray.map((item) => ({ ...item, cashMovementId }));

      await prisma.paymentMethodDetails.createMany({ data: mappedPayments });

      // Create Other Tributes Details
      const mappedOtherTributes = otherTributes.map((item) => ({
        amount: item.amount,
        otherTributeId: item.otherTributeId,
        cashMovementId,
      }));

      await prisma.otherTributesDetails.createMany({ data: mappedOtherTributes });

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

      // Update Invoce Number
      await prisma.settings.update({ where: { id: 1 }, data: { invoceNumber: { increment: 1 } } });

      // Create Movement
      // await prisma.movements.create({ data: { type: 'IN', amount: subtotal + subtotalOtherTributes, userId } });

      /* if (iva) {
        console.log('CREAREMOS UNA FACTURA AFIP');
        // Create AFIP Invoce
        const { invoceIdAfip, invoceNumberAfip, cae, voucherInfo, vtoCae, cbteTipo, impTotal, error } =
          await createAfipInvoce(req.body);

        // Update Cash Movement
        if (cae) {
          cashMovement = await prisma.cashMovements.update({
            where: { id: cashMovementId },
            data: { invoceIdAfip, invoceNumberAfip, cae, vtoCae, cbteTipo, impTotal },
          });
        }

        console.log({ voucherInfo });

        return endpointResponse({
          res,
          code: 200,
          status: true,
          message: 'Movimiento creado',
          body: {
            cashMovement: {
              ...cashMovement,
              voucherInfo,
              error,
            },
          },
        });
      } */
      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Movimiento creado',
        body: {
          cashMovement,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Cash Movements - CREATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const checkCart = asyncHandler(
  async (req: Request<unknown, unknown, any>, res: Response, next: NextFunction) => {
    try {
      const { cart, warehouseId } = req.body;
      const filteredCart = cart.filter((el) => !el.allow);
      filteredCart.sort((a, b) => a.productId - b.productId);

      const ids = filteredCart.map((el) => el.productId);
      const stocks = await prisma.stocks.findMany({
        where: { warehouseId, productId: { in: ids } },
        select: { productId: true, stock: true },
      });

      const error: number[] = [];

      for (let index = 0; index < filteredCart.length; index++) {
        if (filteredCart[index].quantity > stocks[index].stock) error.push(filteredCart[index].productId);
      }

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Caja creada',
        body: {
          error,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Cash Registers - CHECK CART]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

//TODO Undo Cash Movement
