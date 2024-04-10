import { CreateCashMovementsType } from '../schemas/cashMovement.schema';
import Afip from '@afipsdk/afip.js';
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
  Iva: Iva[];
  Tributos?: Tribute[];
};

const calcId = (num: number): number => {
  if (num === 0.105) return 4;
  if (num === 0.21) return 5;
  if (num === 0.27) return 6;
  if (num === 0.05) return 8;
  if (num === 0.025) return 9;
  return 3;
};

const toTwoDigits = (num: number): number => Math.round(num * 100) / 100;

export const createAfipInvoce = async (props: CreateCashMovementsType) => {
  const { clientId, discount, recharge, cart, invoceTypeId, otherTributes } = props;

  const afip = new Afip({ CUIT: process.env.CUIT, cert: './cert.crt', key: './key.key' });
  const afipSettings = await prisma.afip.findFirst();
  const client = await prisma.clients.findFirst({ where: { id: clientId } });
  const identification = await prisma.identifications.findFirst({ where: { id: client?.identificationId } });
  const fecha = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];

  // TOTALS
  const subtotal = cart.reduce((acc, item) => acc + item.quantity * item.price, 0);
  let importeNeto = toTwoDigits(subtotal);

  const otrosImpuestos = otherTributes.reduce((acc, item) => acc + item.amount, 0);

  // IVA TYPES
  const iva: Array<{ Id: number; BaseImp: number; Importe: number }> = [];

  const fede = cart.reduce((acc, el) => {
    acc[el.tax] ??= el.tax;
    return acc;
  }, {});

  const porcentajes: Array<number> = Object.values(fede);

  porcentajes.forEach((item) => {
    const filteredCart = cart.filter((el) => el.tax === item);
    const cartSubtotal = toTwoDigits(filteredCart.reduce((acc, item) => acc + item.quantity * item.price, 0));
    const cartTotalIva = toTwoDigits(
      filteredCart.reduce((acc, item) => acc + item.quantity * item.price * item.tax, 0),
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
  let importeTotal = importeNeto + otrosImpuestos + totalIva;

  if (discount > 0) {
    const carro = cart.reduce((acc, el) => acc + el.quantity * el.price * (1 + el.tax), 0);
    const percentage = discount / carro;
    importeNeto = toTwoDigits(subtotal * (1 - percentage));

    for (const item of iva) {
      const per = Math.round((item.Importe / item.BaseImp) * 1000) / 1000;

      const aux = toTwoDigits(item.BaseImp * (1 - percentage));

      item.BaseImp = aux;
      item.Importe = toTwoDigits(aux * per);
    }

    totalIva = toTwoDigits(iva.reduce((acc, item) => acc + item.Importe, 0));
    importeTotal = importeNeto + otrosImpuestos + totalIva;
  }

  if (recharge > 0) {
    const carro = cart.reduce((acc, el) => acc + el.quantity * el.price * (1 + el.tax), 0);
    const percentage = recharge / carro;
    importeNeto = toTwoDigits(subtotal * (1 + percentage));

    for (const item of iva) {
      const per = Math.round((item.Importe / item.BaseImp) * 1000) / 1000;

      const aux = toTwoDigits(item.BaseImp * (1 + percentage));

      item.BaseImp = aux;
      item.Importe = toTwoDigits(aux * per);
    }

    totalIva = toTwoDigits(iva.reduce((acc, item) => acc + item.Importe, 0));
    importeTotal = toTwoDigits(importeNeto + otrosImpuestos + totalIva);
  }

  const importe_exento_iva = 0;

  // INVOCE TYPE
  let invoceId: number;

  if (invoceTypeId === 1) {
    console.log('FACTURA A');
    invoceId = 1;
  } else if (invoceTypeId === 2) {
    console.log('FACTURA B');
    invoceId = 6;
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
    ImpTotal: importeTotal,
    ImpTotConc: 0, // Importe neto no gravado
    ImpNeto: importeNeto,
    ImpOpEx: importe_exento_iva,
    ImpIVA: totalIva,
    ImpTrib: otrosImpuestos, //Importe total de tributos
    MonId: 'PES',
    MonCotiz: 1,
    Iva: iva,
  };

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
  try {
    const response = await afip.ElectronicBilling.createVoucher(data);
    const voucherInfo = await afip.ElectronicBilling.getVoucherInfo(lastVoucher + 1, afipSettings?.posNumber, invoceId);

    const date = afip.ElectronicBilling.formatDate(voucherInfo.FchVto);

    return {
      invoceIdAfip: invoceId,
      cbteTipo: voucherInfo.CbteTipo,
      invoceNumberAfip: lastVoucher + 1,
      cae: response.CAE,
      vtoCae: new Date(date),
      impTotal: voucherInfo.ImpTotal,
      voucherInfo,
      error: null,
    };
  } catch (error) {
    return {
      invoceIdAfip: null,
      cbteTipo: null,
      invoceNumberAfip: null,
      cae: null,
      vtoCae: null,
      impTotal: null,
      voucherInfo: null,
      error,
    };
  }
};
