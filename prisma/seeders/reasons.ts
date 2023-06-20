import { DateTime } from 'luxon';

const now = DateTime.now();

export const reasons = [
  {
    reason: 'destrucción',
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
  {
    reason: 'extravío',
    createdAt: now.plus({ minutes: 2 }).toString(),
    updatedAt: now.plus({ minutes: 2 }).toString(),
  },
];
