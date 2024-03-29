import { DateTime } from 'luxon';

const now = DateTime.now();

export const paymentMethodDetails = [
  {
    cashMovementId: 1,
    amount: 6000,
    paymentMethodId: 1,
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
  {
    cashMovementId: 1,
    amount: 3770.25,
    paymentMethodId: 2,
    createdAt: now.plus({ seconds: 2 }).toString(),
    updatedAt: now.plus({ seconds: 2 }).toString(),
  },
  {
    cashMovementId: 2,
    amount: 5000,
    paymentMethodId: 1,
    createdAt: now.plus({ seconds: 3 }).toString(),
    updatedAt: now.plus({ seconds: 3 }).toString(),
  },
  {
    cashMovementId: 2,
    amount: 4770.25,
    paymentMethodId: 2,
    createdAt: now.plus({ seconds: 4 }).toString(),
    updatedAt: now.plus({ seconds: 4 }).toString(),
  },
];
