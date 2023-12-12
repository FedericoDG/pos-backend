import { DateTime } from 'luxon';

const now = DateTime.now();

export const paymentMethods = [
  {
    code: 'Efectivo',
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
  {
    code: 'Débito',
    createdAt: now.plus({ seconds: 2 }).toString(),
    updatedAt: now.plus({ seconds: 2 }).toString(),
  },
  {
    code: 'Crédito',
    createdAt: now.plus({ seconds: 3 }).toString(),
    updatedAt: now.plus({ seconds: 3 }).toString(),
  },
  {
    code: 'Transferencia',
    createdAt: now.plus({ seconds: 4 }).toString(),
    updatedAt: now.plus({ seconds: 4 }).toString(),
  },
  {
    code: 'MercadoPago',
    createdAt: now.plus({ seconds: 5 }).toString(),
    updatedAt: now.plus({ seconds: 5 }).toString(),
  },
];
