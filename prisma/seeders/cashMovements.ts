import { DateTime } from 'luxon';

const now = DateTime.now();

export const cashMovements = [
  {
    cashRegisterId: 1,
    subtotal: 9450,
    recharge: 0,
    discount: 0,
    total: 9450,
    warehouseId: 1,
    clientId: 1,
    userId: 3,
    info: '',
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
  {
    cashRegisterId: 2,
    subtotal: 9450,
    recharge: 0,
    discount: 0,
    total: 9450,
    warehouseId: 3,
    clientId: 1,
    userId: 4,
    info: '',
    createdAt: now.plus({ minutes: 2 }).toString(),
    updatedAt: now.plus({ minutes: 2 }).toString(),
  },
];
