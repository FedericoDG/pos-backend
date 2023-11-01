import { DateTime } from 'luxon';

const now = DateTime.now();

export const reasons = [
  {
    reason: 'destrucción',
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
  {
    reason: 'extravío',
    createdAt: now.plus({ seconds: 2 }).toString(),
    updatedAt: now.plus({ seconds: 2 }).toString(),
  },
];
