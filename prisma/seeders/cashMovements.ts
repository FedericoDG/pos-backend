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
    paymentMethodId: 1,
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
];
