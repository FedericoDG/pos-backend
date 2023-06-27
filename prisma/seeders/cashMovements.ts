import { DateTime } from 'luxon';

const now = DateTime.now();

export const cashMovements = [
  {
    cashRegisterId: 1,
    amount: 6705,
    warehouseId: 1,
    clientId: 1,
    userId: 3,
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
];
