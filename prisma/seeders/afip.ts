import { DateTime } from 'luxon';

const now = DateTime.now();

export const afip = [
  {
    posNumber: 1,
    maxPerInvoice: 92720,
    certExpiration: DateTime.fromISO('2025-09-06').toString(),
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
];
