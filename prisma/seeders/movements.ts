import { MovementType } from '@prisma/client';
import { DateTime } from 'luxon';

const now = DateTime.now();

export const movements = [
  {
    amount: 28770,
    type: MovementType.OUT,
    concept: 'Compra',
    userId: 3,
    paymentMethodId: 1,
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
  {
    amount: 6000,
    type: MovementType.IN,
    concept: 'Venta',
    userId: 3,
    clientId: 1,
    paymentMethodId: 1,
    cashMovementId: 1,
    createdAt: now.plus({ minutes: 2 }).toString(),
    updatedAt: now.plus({ minutes: 2 }).toString(),
  },
  {
    amount: 3770.25,
    type: MovementType.IN,
    concept: 'Venta',
    userId: 3,
    clientId: 1,
    paymentMethodId: 2,
    cashMovementId: 1,
    createdAt: now.plus({ minutes: 3 }).toString(),
    updatedAt: now.plus({ minutes: 3 }).toString(),
  },
  {
    amount: 5000,
    type: MovementType.IN,
    concept: 'Venta',
    userId: 4,
    clientId: 2,
    paymentMethodId: 1,
    cashMovementId: 2,
    createdAt: now.plus({ minutes: 4 }).toString(),
    updatedAt: now.plus({ minutes: 4 }).toString(),
  },
  {
    amount: 4770.25,
    type: MovementType.IN,
    concept: 'Venta',
    userId: 4,
    clientId: 2,
    paymentMethodId: 2,
    cashMovementId: 2,
    createdAt: now.plus({ minutes: 5 }).toString(),
    updatedAt: now.plus({ minutes: 5 }).toString(),
  },
  {
    amount: 4103.5,
    type: MovementType.OUT,
    concept: 'Baja/Pérdida',
    userId: 3,
    paymentMethodId: 1,
    createdAt: now.plus({ minutes: 6 }).toString(),
    updatedAt: now.plus({ minutes: 6 }).toString(),
  },
];
