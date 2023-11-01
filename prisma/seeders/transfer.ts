import { DateTime } from 'luxon';

const now = DateTime.now();

export const transfer = [
  {
    warehouseOriginId: 1,
    warehouseDestinationId: 2,
    userId: 2,
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
];
