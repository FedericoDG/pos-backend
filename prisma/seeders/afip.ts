import { DateTime } from 'luxon';

const now = DateTime.now();

export const afip = [
  {
    posNumber: 1,
    certExpiration: DateTime.fromISO('2025-09-06').toString(),
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
];