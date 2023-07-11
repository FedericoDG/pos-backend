import { DateTime } from 'luxon';

const now = DateTime.now();

export const paymentMethodDetails = [
  {
    cashMovementId: 1,
    amount: 6000,
    paymentMethodId: 1,
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
  {
    cashMovementId: 1,
    amount: 3450,
    paymentMethodId: 2,
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
];
