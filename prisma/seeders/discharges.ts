import { DateTime } from 'luxon';

const now = DateTime.now();

export const discharges = [
  {
    warehouseId: 1,
    userId: 3,
    cost: 4103.5,
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
];
