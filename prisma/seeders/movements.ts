import { MovementType } from '@prisma/client';
import { DateTime } from 'luxon';

const now = DateTime.now();

export const movements = [
  {
    amount: 9770.25,
    type: MovementType.IN,
    userId: 3,
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
  {
    amount: 9770.25,
    type: MovementType.IN,
    userId: 4,
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
];
