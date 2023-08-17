import { DateTime } from 'luxon';

const now = DateTime.now();

export const userPreferences = [
  {
    userId: 1,
    warehouseId: 1,
    priceListId: 1,
    clientId: 1,
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
  {
    userId: 2,
    warehouseId: 1,
    priceListId: 1,
    clientId: 1,
    createdAt: now.plus({ minutes: 2 }).toString(),
    updatedAt: now.plus({ minutes: 2 }).toString(),
  },
  {
    userId: 3,
    warehouseId: 1,
    priceListId: 1,
    clientId: 1,
    createdAt: now.plus({ minutes: 3 }).toString(),
    updatedAt: now.plus({ minutes: 3 }).toString(),
  },
  {
    userId: 4,
    warehouseId: 1,
    priceListId: 1,
    clientId: 1,
    createdAt: now.plus({ minutes: 4 }).toString(),
    updatedAt: now.plus({ minutes: 4 }).toString(),
  },
];
