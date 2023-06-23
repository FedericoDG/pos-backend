import { DateTime } from 'luxon';

const now = DateTime.now();

export const transfer = [
  {
    warehouseOriginId: 1,
    warehouseDestinationId: 2,
    userId: 3,
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
];
