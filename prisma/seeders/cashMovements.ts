import { DateTime } from 'luxon';

const now = DateTime.now();

export const cashMovements = [
  {
    cashRegisterId: 1,
    subtotal: 9450,
    total: 9450,
    warehouseId: 1,
    clientId: 1,
    userId: 1,
    invoceTypeId: 4,
    posNumber: 1,
    invoceNumber: 1,
    iva: false,
    info: '',
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
  {
    cashRegisterId: 2,
    subtotal: 9450,
    total: 9450,
    warehouseId: 1,
    clientId: 2,
    userId: 2,
    invoceTypeId: 4,
    posNumber: 1,
    invoceNumber: 2,
    iva: false,
    info: '',
    createdAt: now.plus({ seconds: 2 }).toString(),
    updatedAt: now.plus({ seconds: 2 }).toString(),
  },
];
