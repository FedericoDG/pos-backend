import { DateTime } from 'luxon';

const now = DateTime.now();

export const transferDetails = [
  {
    transferId: 1,
    productId: 3,
    quantity: 12,
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
  {
    transferId: 1,
    productId: 4,
    quantity: 7,
    createdAt: now.plus({ minutes: 2 }).toString(),
    updatedAt: now.plus({ minutes: 2 }).toString(),
  },
  {
    transferId: 1,
    productId: 5,
    quantity: 14,
    createdAt: now.plus({ minutes: 3 }).toString(),
    updatedAt: now.plus({ minutes: 3 }).toString(),
  },
];
