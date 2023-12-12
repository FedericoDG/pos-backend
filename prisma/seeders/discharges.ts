import { DateTime } from 'luxon';

const now = DateTime.now();

export const discharges = [
  {
    warehouseId: 1,
    userId: 1,
    cost: 1441.05,
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
];
