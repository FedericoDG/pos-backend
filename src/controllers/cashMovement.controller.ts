import { NextFunction, Response, Request } from 'express';
import { MovementType } from '@prisma/client';
import createHttpError from 'http-errors';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';

import { CreateCashMovementsType, LibroIVAType } from '../schemas/cashMovement.schema';
import prisma from '../helpers/prisma';

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
        message: 'Movimientos Recuperados',
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

export const getAllDetails = asyncHandler(
  async (req: Request<unknown, unknown, unknown, LibroIVAType>, res: Response, next: NextFunction) => {
    try {
      const { from, to, invoices } = req.query;

      const invoicesIds: number[] = JSON.parse(invoices!);
      if (invoicesIds.includes(1)) invoicesIds.push(5);
      if (invoicesIds.includes(2)) invoicesIds.push(6);
      if (invoicesIds.includes(3)) invoicesIds.push(7);

      const parsedFrom = new Date(from!.concat(' 00:00:00'));
      const parsedTo = new Date(to!.concat(' 23:59:59'));

      const creditNotesIds = [5, 6, 7, 8];

      const cashMovements = await prisma.cashMovements.findMany({
        where: {
          iva: true,
          invoceTypeId: { in: invoicesIds },
          createdAt: {
            gte: parsedFrom,
            lte: parsedTo,
          },
        },
        include: { cashMovementsDetails: true, client: true },
        orderBy: [{ id: 'desc' }],
      });

      const libroIva = cashMovements.map((el) => {
        const reduced = el.cashMovementsDetails.reduce(
          (acc: any, curr: any) => {
            const key = curr.tax;
            console.log('key', curr.tax);
            console.log('acc[key]', acc[key]);
            console.log(curr.totalIVA);

            acc[key] += curr.totalIVA;
            console.log(acc);

            return acc;
          },
          {
            '0': 0,
            '0.025': 0,
            '0.05': 0,
            '0.105': 0,
            '0.21': 0,
            '0.27': 0,
          },
        );

        if (!reduced['0']) reduced['0'] = 0;
        if (!reduced['0.025']) reduced['0.025'] = 0;
        if (!reduced['0.05']) reduced['0.05'] = 0;
        if (!reduced['0.105']) reduced['0.105'] = 0;
        if (!reduced['0.21']) reduced['0.21'] = 0;
        if (!reduced['0.27']) reduced['0.27'] = 0;

        const iva =
          reduced['0'] + reduced['0.025'] + reduced['0.05'] + reduced['0.105'] + reduced['0.21'] + reduced['0.27'];
        let subTotal;
        if (iva > 0) {
          subTotal = el.total - iva;
        } else {
          subTotal = el.total + iva;
        }

        let total;
        if (iva > 0) {
          total = subTotal + iva;
        } else {
          total = (subTotal - iva) * -1;
        }

        const obj = {
          id: el.id,
          isCreditNote: false,
          subTotal,
          iva,
          total,
          invoceTypeId: el.invoceTypeId,
          posNumber: el.posNumber,
          invoceNumberAfip: el.invoceNumberAfip,
          cae: el.cae,
          vtoCae: el.vtoCae,
          creditNote: el.creditNote,
          cbteTipo: el.cbteTipo,
          info: el.info,
          ivaDetails: reduced,
          createdAt: el.createdAt,
          client: el.client,
        };

        if (creditNotesIds.includes(el.invoceTypeId)) {
          obj.isCreditNote = true;
        }

        return obj;
      });

      const totalSubTotal = libroIva.reduce((acc, curr) => {
        if (curr.isCreditNote) {
          return acc - curr.subTotal;
        } else {
          return acc + curr.subTotal;
        }
      }, 0);

      const totalIva = libroIva.reduce((acc, curr) => {
        if (curr.isCreditNote) {
          return acc + curr.iva;
        } else {
          return acc + curr.iva;
        }
      }, 0);

      const totalTotal = libroIva.reduce((acc, curr) => {
        if (curr.isCreditNote) {
          return acc + curr.total;
        } else {
          return acc + curr.total;
        }
      }, 0);

      const total0 = libroIva.filter((el) => el.ivaDetails['0']).reduce((acc, curr) => acc + curr.ivaDetails['0'], 0);
      const total0025 = libroIva
        .filter((el) => el.ivaDetails['0.025'])
        .reduce((acc, curr) => acc + curr.ivaDetails['0.025'], 0);
      const total005 = libroIva
        .filter((el) => el.ivaDetails['0.05'])
        .reduce((acc, curr) => acc + curr.ivaDetails['0.05'], 0);
      const total0105 = libroIva
        .filter((el) => el.ivaDetails['0.105'])
        .reduce((acc, curr) => acc + curr.ivaDetails['0.105'], 0);
      const total021 = libroIva
        .filter((el) => el.ivaDetails['0.21'])
        .reduce((acc, curr) => acc + curr.ivaDetails['0.21'], 0);
      const total027 = libroIva
        .filter((el) => el.ivaDetails['0.27'])
        .reduce((acc, curr) => acc + curr.ivaDetails['0.27'], 0);

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Libro IVA Recuperado',
        body: {
          from: parsedFrom,
          to: parsedTo,
          totalSubTotal,
          totalIva,
          totalTotal,
          total0,
          total0025,
          total005,
          total0105,
          total021,
          total027,
          movements: libroIva,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Libro IVA - GET ALL]: ${error.message}`);
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

      const isCheckingAccount = payments.some((el) => el.paymentMethodId === 6);
      console.log({ isCheckingAccount });

      const cashRegister = await prisma.cashRegisters.findFirst({ where: { userId }, orderBy: [{ id: 'desc' }] });
      const settings = await prisma.settings.findFirst({ select: { invoceNumber: true } });
      const afip = await prisma.afip.findFirst({ select: { posNumber: true } });

      const cartWithIVA = cart.map((el) => ({
        ...el,
        totalIVA:
          (el.price * el.quantity - el.totalDiscount) * (el.tax * (1 - discountPercent / 100 + rechargePercent / 100)),
      }));

      const productsIds = cartWithIVA.map((item) => item.productId);
      const subtotalOtherTributes = otherTributes.reduce((acc, item) => acc + item.amount, 0);
      //
      const subtotal = cartWithIVA.reduce(
        (acc, item) => acc + (item.quantity * item.price - item.totalDiscount) + item.totalIVA,
        0,
      );

      /*    if (discountPercent > 0) {
        subtotal = cartWithIVA.reduce(
          (acc, item) =>
            acc + (item.quantity * item.price - item.totalDiscount) * (1 + item.tax * (1 - discountPercent / 100)),
          0,
        );
      } */

      const cashRegisterId = cashRegister?.id || 1;
      const cashRegisterFinalBalance = cashRegister?.finalBalance || 0;
      const finalBalance = cashRegisterFinalBalance + subtotal + subtotalOtherTributes;

      // Update Cash Register
      await prisma.cashRegisters.update({
        where: { id: cashRegisterId },
        data: { finalBalance: finalBalance },
      });

      const data: any = {
        iva,
        cashRegisterId,
        subtotal: subtotal,
        discount,
        discountPercent,
        recharge,
        rechargePercent,
        otherTributes: subtotalOtherTributes,
        total: subtotal + subtotalOtherTributes - discount + recharge,
        warehouseId,
        clientId,
        userId,
        posNumber: afip?.posNumber || 1,
        invoceTypeId,
        invoceNumber: settings?.invoceNumber || 0,
        info,
      };

      // Create Cash Movement
      const cashMovement = await prisma.cashMovements.create({ data });

      // Create Cash Movement Details
      const cashMovementId = cashMovement.id;

      const cartWithcashMovementId = cartWithIVA.map((item) => ({
        productId: item.productId,
        price: item.price,
        quantity: item.quantity,
        tax: item.tax,
        cashMovementId,
        totalDiscount: item.totalDiscount,
        totalIVA: item.totalIVA,
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
      cartWithIVA.sort((a, b) => a.productId - b.productId);

      const newStock = uniqueStocksOrigin.map((item, idx) => {
        return {
          id: item.id,
          productId: item.productId,
          warehouseId: warehouseId,
          stock: item.stock - cartWithIVA[idx]!.quantity,
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

      // Create Balance
      const movement = await prisma.movements.create({
        data: {
          amount: subtotal + subtotalOtherTributes,
          type: MovementType.IN,
          concept: 'Venta',
          userId,
          clientId,
          paymentMethodId: 1,
          cashMovementId,
        },
      });

      // Stock Details
      const stockDetails = newStock.map((item) => ({
        productId: item.productId,
        warehouseId: item.warehouseId,
        stock: item.stock,
        movementId: movement.id,
      }));

      await prisma.stocksDetails.createMany({ data: stockDetails });

      // TODO: Create checking account

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

export const createCreditNote = asyncHandler(
  async (req: Request<unknown, unknown, any>, res: Response, next: NextFunction) => {
    try {
      const { clientId, warehouseId, cart, payments, cashMovementId: cashMId } = req.body;

      // Update Cash Register
      const importeTotal = cart.reduce((acc, item) => acc + item.quantity * item.price, 0);
      const cashRegister = await prisma.cashRegisters.findFirst({
        where: { userId: req.user.id },
        orderBy: [{ id: 'desc' }],
      });

      const cashRegisterFinalBalance = cashRegister?.finalBalance || 0;
      const finalBalance = cashRegisterFinalBalance - importeTotal;

      await prisma.cashRegisters.update({
        where: { id: Number(cashRegister?.id) },
        data: { finalBalance: finalBalance },
      });

      const invId = 8;

      const afipSettings = await prisma.afip.findFirst();

      const settings = await prisma.settings.findFirst({ select: { invoceNumber: true } });

      const cashMovement = await prisma.cashMovements.create({
        data: {
          iva: false,
          cashRegisterId: Number(cashRegister?.id),
          subtotal: importeTotal,
          discount: 0,
          discountPercent: 0,
          recharge: 0,
          rechargePercent: 0,
          otherTributes: 0,
          total: importeTotal + 0,
          warehouseId,
          clientId,
          userId: req.user.id,
          posNumber: afipSettings?.posNumber || 1,
          invoceTypeId: invId,
          invoceNumber: settings?.invoceNumber || 0,
          info: '',
          invoceIdAfip: null,
          invoceNumberAfip: null,
          cae: null,
          vtoCae: null,
          cbteTipo: null,
          impTotal: null,
        },
      });

      // UpdateInvoceNumber
      await prisma.settings.update({ where: { id: 1 }, data: { invoceNumber: { increment: 1 } } });

      // Create Cash Movement Details
      const cashMovementId = cashMovement.id;

      // Udate Original CashMovemnet
      await prisma.cashMovements.update({ where: { id: cashMId }, data: { creditNote: cashMovementId } });

      // Udate Original CashMovemnet
      await prisma.cashMovements.update({ where: { id: cashMId }, data: { creditNote: cashMovementId } });

      const cartWithcashMovementId = cart.map((item) => {
        return {
          productId: item.productId,
          price: item.price,
          quantity: item.quantity,
          tax: item.tax,
          cashMovementId,
          // totalIVA: (item.price * item.quantity - item.totalDiscount) * item.tax * -1,
        };
      });

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
      const mappedPayments = reducedPaymentsArray.map((item) => ({ ...item, cashMovementId, isCreditNote: 1 }));

      await prisma.paymentMethodDetails.createMany({ data: mappedPayments });

      // Create Balance
      const movement = await prisma.movements.create({
        data: {
          amount: importeTotal,
          type: MovementType.OUT,
          concept: 'N. de Crédito',
          paymentMethodId: 1,
          userId: req.user.id,
          clientId,
          cashMovementId,
        },
      });

      //Update Warehouse
      const productIds = cart.map((item) => item.productId);
      const sortedCart = [...cart].sort((a, b) => a.productId - b.productId);
      const stock = await prisma.stocks.findMany({
        where: { warehouseId, productId: { in: productIds } },
        orderBy: [{ id: 'asc' }],
      });
      const updatedStock = stock.map((item, idx) => ({ id: item.id, stock: item.stock + sortedCart[idx].quantity }));
      const updatedStock2 = stock.map((item, idx) => ({
        id: item.id,
        productId: item.productId,
        stock: item.stock + sortedCart[idx].quantity,
      }));

      await Promise.all(updatedStock.map((el) => prisma.stocks.update({ where: { id: el.id }, data: { ...el } })));

      // Stock Details
      const stockDetails = updatedStock2.map((item) => ({
        productId: item.productId,
        warehouseId,
        stock: item.stock,
        movementId: movement.id,
      }));

      await prisma.stocksDetails.createMany({ data: stockDetails });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'N. Crédito Creada',
        body: {
          cashMovement,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Cash Movements - N.C. CREATE]: ${error.message}`);
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
        if (filteredCart[index].quantity > stocks[index]!.stock) error.push(filteredCart[index].productId);
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
