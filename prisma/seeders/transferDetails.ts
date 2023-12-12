import { DateTime } from 'luxon';

const now = DateTime.now();

export const transferDetails = [
  {
    transferId: 1,
    productId: 1,
    quantity: 5,
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
  {
    transferId: 1,
    productId: 2,
    quantity: 1,
    createdAt: now.plus({ seconds: 2 }).toString(),
    updatedAt: now.plus({ seconds: 2 }).toString(),
  },
];
