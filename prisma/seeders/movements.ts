import { MovementType } from '@prisma/client';
import { DateTime } from 'luxon';

const now = DateTime.now();

export const movements = [
  {
    amount: 6000,
    type: MovementType.IN,
    concept: 'Venta de productos',
    userId: 3,
    clientId: 1,
    paymentMethodId: 1,
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
  {
    amount: 3770.25,
    type: MovementType.IN,
    concept: 'Venta de productos',
    userId: 3,
    clientId: 1,
    paymentMethodId: 2,
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
  {
    amount: 5000,
    type: MovementType.IN,
    concept: 'Venta de productos',
    userId: 4,
    clientId: 2,
    paymentMethodId: 1,
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
  {
    amount: 4770.25,
    type: MovementType.IN,
    concept: 'Venta de productos',
    userId: 4,
    clientId: 2,
    paymentMethodId: 2,
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
];
