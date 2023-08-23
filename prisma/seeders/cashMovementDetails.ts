import { DateTime } from 'luxon';

const now = DateTime.now();

export const cashMovementDetails = [
  {
    cashMovementId: 1,
    productId: 1,
    price: 640,
    quantity: 10,
    tax: 0,
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
  {
    cashMovementId: 1,
    productId: 2,
    price: 610,
    quantity: 5,
    tax: 0.105,
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
  {
    cashMovementId: 2,
    productId: 1,
    price: 640,
    quantity: 10,
    tax: 0,
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
  {
    cashMovementId: 2,
    productId: 2,
    price: 610,
    quantity: 5,
    tax: 0.105,
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
];
