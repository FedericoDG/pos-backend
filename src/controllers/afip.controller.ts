import { NextFunction, Response, Request } from 'express';
import { MovementType } from '@prisma/client';
import createHttpError from 'http-errors';
import Afip from '@afipsdk/afip.js';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';

import { afipEditSttingsType } from '../schemas/afip.schema';
import { CreateCashMovementsType } from '../schemas/cashMovement.schema';
import prisma from '../helpers/prisma';

type Iva = {
  Id: number;
  BaseImp: number;
  Importe: number;
};

type Tribute = {
  Id: number;
  BaseImp: number;
  Importe: number;
  Alic?: number;
  Desc?: string;
};

type Data = {
  CantReg: number;
  PtoVta: number | undefined;
  CbteTipo: number;
  Concepto: number;
  DocTipo: number;
  DocNro: number;
  CbteDesde: number;
  CbteHasta: number;
  CbteFch: number;
  FchServDesde: number | null;
  FchServHasta: number | null;
  FchVtoPago: number | null;
  ImpTotal: number;
  ImpTotConc: number;
  ImpNeto: number;
  ImpOpEx: number;
  ImpIVA: number;
  ImpTrib: number;
  MonId: string;
  MonCotiz: number;
  Iva?: Iva[];
  Tributos?: Tribute[];
  CbtesAsoc?: [
    {
      Tipo: number;
      PtoVta: number;
      Nro: number;
    },
  ];
};

type CashMovementId = {
  cashMovementId: number;
};

type MovementIds = {
  movementIds: number[];
};

type CreateAfipInvoce = CreateCashMovementsType & CashMovementId & MovementIds;

interface CreateAfipCreditNote extends CreateAfipInvoce {
  invoceTypeId: number;
  invoceNumber: number;
}

const calcId = (num: number): number => {
  if (num === 0.105) return 4;
  if (num === 0.21) return 5;
  if (num === 0.27) return 6;
  if (num === 0.05) return 8;
  if (num === 0.025) return 9;
  return 3;
};

const toTwoDigits = (num: number): number => Math.round(num * 100) / 100;

export const siteSettings = asyncHandler(
  async (_req: Request<unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const settings = await prisma.afip.findFirst({ where: { id: 1 } });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Parámetros de AFIP recuperados',
        body: {
          afip: {
            ...settings,
          },
        },
      });
    } catch (error) {
      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Parámetros de AFIP recuperados',
        body: {
          afip: {
            ...settings,
          },
        },
      });
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[AFIP - GET ONE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const settings = asyncHandler(
  async (_req: Request<unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    const afip = new Afip({ CUIT: process.env.CUIT, cert: './cert.crt', key: './key.key' });

    const settings = await prisma.afip.findFirst({ where: { id: 1 } });

    try {
      const last_voucherA = await afip.ElectronicBilling.getLastVoucher(settings?.posNumber, 1);
      const last_voucherB = await afip.ElectronicBilling.getLastVoucher(settings?.posNumber, 6);
      const last_voucherC = await afip.ElectronicBilling.getLastVoucher(settings?.posNumber, 11);
      const last_voucherM = await afip.ElectronicBilling.getLastVoucher(settings?.posNumber, 51);
      const last_voucherNCA = await afip.ElectronicBilling.getLastVoucher(settings?.posNumber, 3);
      const last_voucherNCB = await afip.ElectronicBilling.getLastVoucher(settings?.posNumber, 8);
      const last_voucherNCC = await afip.ElectronicBilling.getLastVoucher(settings?.posNumber, 13);
      const last_voucherNCM = await afip.ElectronicBilling.getLastVoucher(settings?.posNumber, 53);

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Parámetros de AFIP recuperados',
        body: {
          afip: {
            ...settings,
            nextInvoceNumberA: last_voucherA + 1,
            nextInvoceNumberB: last_voucherB + 1,
            nextInvoceNumberC: last_voucherC + 1,
            nextInvoceNumberM: last_voucherM + 1,
            nextInvoceNumberNCA: last_voucherNCA + 1,
            nextInvoceNumberNCB: last_voucherNCB + 1,
            nextInvoceNumberNCC: last_voucherNCC + 1,
            nextInvoceNumberNCM: last_voucherNCM + 1,
          },
        },
      });
    } catch (error) {
      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Parámetros de AFIP recuperados',
        body: {
          afip: {
            ...settings,
          },
        },
      });
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[AFIP - GET ONE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const editSettings = asyncHandler(
  async (req: Request<unknown, unknown, afipEditSttingsType>, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      const settings = await prisma.afip.update({ where: { id: 1 }, data });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Parámetros de AFIP actualizados',
        body: {
          afip: {
            ...settings,
          },
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[AFIP - UPDATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const create = asyncHandler(
  async (req: Request<unknown, unknown, CreateAfipInvoce>, res: Response, next: NextFunction) => {
    try {
      const {
        clientId,
        cart,
        invoceTypeId,
        otherTributes,
        cashMovementId,
        discount,
        discountPercent,
        recharge,
        rechargePercent,
      } = req.body;

      const afip = new Afip({
        CUIT: process.env.CUIT,
        cert: './cert.crt',
        key: './key.key',
      });
      const afipSettings = await prisma.afip.findFirst();
      const client = await prisma.clients.findFirst({ where: { id: clientId } });
      const identification = await prisma.identifications.findFirst({ where: { id: client?.identificationId } });
      const fecha = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];

      // TOTALS
      const subtotal = cart.reduce((acc, item) => acc + item.quantity * item.price - item.totalDiscount, 0);
      const importeNeto = toTwoDigits(subtotal - discount + recharge);

      const otrosImpuestos = otherTributes.reduce((acc, item) => acc + item.amount, 0);

      // IVA TYPES
      let iva: Array<{ Id: number; BaseImp: number; Importe: number }> = [];

      const ivaArray = cart.reduce((acc, el) => {
        acc[el.tax] ??= el.tax;
        return acc;
      }, {});

      const porcentajes: Array<number> = Object.values(ivaArray);

      porcentajes.forEach((item) => {
        const filteredCart = cart.filter((el) => el.tax === item);
        const cartSubtotal = toTwoDigits(
          filteredCart.reduce((acc, item) => acc + (item.quantity * item.price - item.totalDiscount), 0),
        );
        const cartTotalIva = toTwoDigits(
          filteredCart.reduce((acc, item) => acc + (item.quantity * item.price - item.totalDiscount) * item.tax, 0),
        );
        const id = calcId(item);
        const iva0 = {
          Id: id,
          BaseImp: toTwoDigits(cartSubtotal),
          Importe: cartTotalIva,
        };
        iva.push(iva0);
      });

      let totalIva = toTwoDigits(iva.reduce((acc, item) => acc + item.Importe, 0));
      let importeTotal = toTwoDigits(importeNeto + otrosImpuestos + totalIva);

      const importe_exento_iva = 0;

      if (discountPercent > 0 || rechargePercent > 0) {
        iva = iva.map((iva) => ({
          ...iva,
          BaseImp: toTwoDigits(iva.BaseImp * (1 - discountPercent / 100 + rechargePercent / 100)),
          Importe: toTwoDigits(iva.Importe * (1 - discountPercent / 100 + rechargePercent / 100)),
        }));

        (totalIva = toTwoDigits(totalIva * (1 - discountPercent / 100 + rechargePercent / 100))),
          (importeTotal = toTwoDigits(importeNeto + otrosImpuestos + totalIva));
      }

      // INVOCE TYPE
      let invoceId: number;

      if (invoceTypeId === 1) {
        console.log('FACTURA A');
        invoceId = 1;
      } else if (invoceTypeId === 2) {
        console.log('FACTURA B');
        invoceId = 6;
      } else if (invoceTypeId === 9) {
        console.log('FACTURA C');
        invoceId = 11;
      } else {
        console.log('FACTURA M');
        invoceId = 51;
      }

      // GET LAST VOUCHER NUMBER
      const lastVoucher = await afip.ElectronicBilling.getLastVoucher(afipSettings?.posNumber, invoceId);

      const data: Data = {
        CantReg: 1, // Cantidad de facturas a registrar
        PtoVta: afipSettings?.posNumber,
        CbteTipo: invoceId,
        Concepto: 1,
        DocTipo: parseInt(identification?.code || '80'),
        DocNro: parseInt(client?.document || '000000000'),
        CbteDesde: lastVoucher + 1,
        CbteHasta: lastVoucher + 1,
        CbteFch: parseInt(fecha.replace(/-/g, '')), //20230908
        FchServDesde: null,
        FchServHasta: null,
        FchVtoPago: null,
        ImpTotal: importeTotal, // NETO + IMPUESTOS + IVA
        ImpTotConc: 0, // Importe neto no gravado
        ImpNeto: importeNeto,
        ImpOpEx: importe_exento_iva,
        ImpIVA: invoceId === 11 ? 0 : totalIva,
        ImpTrib: otrosImpuestos, //Importe total de tributos
        MonId: 'PES',
        MonCotiz: 1,
        // Iva: invoceId === 11 ? [] : iva,
      };

      if (invoceId !== 11) {
        data.Iva = iva;
      }

      // TRIBUTES
      if (otherTributes.length > 0) {
        const tributes = otherTributes.map((item) => ({
          Id: item.id,
          BaseImp: importeTotal,
          //Alic: 10,
          Importe: item.amount,
          Desc: item.description,
        }));

        data.ImpTrib = otrosImpuestos;
        data.Tributos = tributes;
      }

      // CREATE AFIP INVOCE
      const response = await afip.ElectronicBilling.createVoucher(data);

      const voucherInfo = await afip.ElectronicBilling.getVoucherInfo(
        lastVoucher + 1,
        afipSettings?.posNumber,
        invoceId,
      );

      const date = afip.ElectronicBilling.formatDate(voucherInfo.FchVto);

      // Update Cash Movement
      const cashMovement = await prisma.cashMovements.update({
        where: { id: cashMovementId },
        data: {
          invoceIdAfip: invoceId,
          invoceNumberAfip: lastVoucher + 1,
          cae: response.CAE,
          vtoCae: new Date(date),
          cbteTipo: voucherInfo.CbteTipo,
          impTotal: voucherInfo.ImpTotal,
        },
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'AFIP',
        body: {
          cashMovement,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        let errorCode = 99999;
        let message = error.message;

        if (error.message.substring(1, 6) === '10013') {
          errorCode = 10013;
          message = 'Para hacer un Comprobante "A" el cliente debe tener un CUIT asociado';
        }
        if (error.message.substring(1, 6) === '10056') {
          errorCode = 10013;
          message = 'El campo "importe total" soporta 13 números para la parte entera y 2 para los decimales.';
        }

        endpointResponse({
          res,
          code: 400,
          status: false,
          message: 'AFIP',
          body: {
            code: errorCode,
            message,
          },
        });

        const httpError = createHttpError(500, `[AFIP - CREATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const creditNote = asyncHandler(
  async (req: Request<unknown, unknown, CreateAfipCreditNote>, res: Response, next: NextFunction) => {
    try {
      const {
        clientId,
        warehouseId,
        invoceTypeId,
        invoceNumber,
        cart,
        payments,
        cashMovementId: cashMId,
        discount,
        recharge,
      } = req.body;

      const afip = new Afip({
        CUIT: process.env.CUIT,
        cert: './cert.crt',
        key: './key.key',
      });
      const afipSettings = await prisma.afip.findFirst();
      const client = await prisma.clients.findFirst({ where: { id: clientId } });
      const identification = await prisma.identifications.findFirst({ where: { id: client?.identificationId } });
      const fecha = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];

      // TOTALS
      const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const importeNeto = toTwoDigits(subtotal - discount + recharge);

      const otrosImpuestos = 0;

      // IVA TYPES
      const iva: Array<{ Id: number; BaseImp: number; Importe: number }> = [];

      const ivaArray = cart.reduce((acc, el) => {
        acc[el.tax] ??= el.tax;
        return acc;
      }, {});

      const porcentajes: Array<number> = Object.values(ivaArray);

      porcentajes.forEach((item) => {
        const filteredCart = cart.filter((el) => el.tax === item);
        const cartSubtotal = toTwoDigits(filteredCart.reduce((acc, item) => acc + item.quantity * item.price, 0));
        const cartTotalIva = toTwoDigits(filteredCart.reduce((acc, item) => acc + item.totalIVA!, 0));
        const id = calcId(item);
        const iva0 = {
          Id: id,
          BaseImp: toTwoDigits(cartSubtotal),
          Importe: cartTotalIva,
        };
        iva.push(iva0);
      });

      const totalIva = toTwoDigits(iva.reduce((acc, item) => acc + item.Importe, 0));

      const importeTotal = toTwoDigits(importeNeto + otrosImpuestos + totalIva);

      const importe_exento_iva = 0;

      // INVOCE TYPE
      let invoceId: number;
      let invId: number;

      console.log({ invoceTypeId });
      if (invoceTypeId === 1) {
        console.log('NOTA DE CRÉDITO A');
        invoceId = 3;
        invId = 5;
      } else if (invoceTypeId === 6) {
        console.log('NOTA DE CRÉDITO B');
        invoceId = 8;
        invId = 6;
      } else if (invoceTypeId === 11) {
        console.log('NOTA DE CRÉDITO C');
        invoceId = 13;
        invId = 10;
      } else {
        console.log('NOTA DE CRÉDITO M');
        invoceId = 53;
        invId = 7;
      }

      // GET LAST VOUCHER NUMBER
      const lastVoucher = await afip.ElectronicBilling.getLastVoucher(afipSettings?.posNumber, invoceId);

      const data: Data = {
        CantReg: 1,
        PtoVta: afipSettings?.posNumber,
        CbteTipo: invoceId,
        Concepto: 1,
        DocTipo: parseInt(identification?.code || '80'),
        DocNro: parseInt(client?.document || '000000000'),
        CbteDesde: lastVoucher + 1,
        CbteHasta: lastVoucher + 1,
        CbteFch: parseInt(fecha.replace(/-/g, '')),
        FchServDesde: null,
        FchServHasta: null,
        FchVtoPago: null,
        ImpTotal: importeTotal,
        ImpTotConc: 0, // Importe neto no gravado
        ImpNeto: importeNeto,
        ImpOpEx: importe_exento_iva,
        ImpIVA: totalIva,
        ImpTrib: 0,
        MonId: 'PES',
        MonCotiz: 1,
        CbtesAsoc: [
          {
            Tipo: invoceId,
            PtoVta: afipSettings?.posNumber || 1,
            Nro: invoceNumber,
          },
        ],
        // Iva: iva,
      };

      if (invoceId !== 13) {
        data.Iva = iva;
      }

      // CREATE AFIP INVOCE
      const response = await afip.ElectronicBilling.createVoucher(data);

      const voucherInfo = await afip.ElectronicBilling.getVoucherInfo(
        lastVoucher + 1,
        afipSettings?.posNumber,
        invoceId,
      );

      const date = afip.ElectronicBilling.formatDate(voucherInfo.FchVto);

      // Update Cash Register
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

      // Create Cash Movement
      const settings = await prisma.settings.findFirst({ select: { invoceNumber: true } });
      const cashMovement = await prisma.cashMovements.create({
        data: {
          iva: true,
          cashRegisterId: Number(cashRegister?.id),
          subtotal: importeTotal + discount - recharge,
          discount: discount,
          discountPercent: 0,
          recharge: recharge,
          rechargePercent: 0,
          otherTributes: 0,
          total: importeTotal,
          warehouseId,
          clientId,
          userId: req.user.id,
          posNumber: afipSettings?.posNumber || 1,
          invoceTypeId: invId,
          invoceNumber: settings?.invoceNumber || 0,
          info: '',
          invoceIdAfip: invoceId,
          invoceNumberAfip: lastVoucher + 1,
          cae: response.CAE,
          vtoCae: new Date(date),
          cbteTipo: invoceId,
          impTotal: voucherInfo.ImpTotal,
        },
      });

      // UpdateInvoceNumber
      await prisma.settings.update({ where: { id: 1 }, data: { invoceNumber: { increment: 1 } } });

      // Create Cash Movement Details
      const cashMovementId = cashMovement.id;

      // Udate Original CashMovemnet
      await prisma.cashMovements.update({ where: { id: cashMId }, data: { creditNote: cashMovementId } });

      const cartWithcashMovementId = cart.map((item) => ({
        productId: item.productId,
        price: item.price,
        quantity: item.quantity,
        tax: item.tax,
        cashMovementId,
        totalIVA: (item.price * item.quantity - item.totalDiscount) * item.tax * -1,
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
      const mappedPayments = reducedPaymentsArray.map((item) => ({ ...item, cashMovementId, isCreditNote: 1 }));

      await prisma.paymentMethodDetails.createMany({ data: mappedPayments });

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
        message: 'AFIP',
        body: {
          cashMovement,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        let errorCode = 99999;
        let message = error.message;

        if (error.message.substring(1, 6) === '10013') {
          errorCode = 10013;
          message = 'Para hacer un Comprobante "A" el cliente debe tener un CUIT asociado';
        }
        if (error.message.substring(1, 6) === '10056') {
          errorCode = 10013;
          message = 'El campo "importe total" soporta 13 números para la parte entera y 2 para los decimales.';
        }

        endpointResponse({
          res,
          code: 400,
          status: false,
          message: 'AFIP',
          body: {
            code: errorCode,
            message,
          },
        });

        const httpError = createHttpError(500, `[AFIP - CREATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);
