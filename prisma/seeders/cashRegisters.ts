import { DateTime } from 'luxon';

const now = DateTime.now();

export const cashRegisters = [
  {
    openingDate: now.plus({ minutes: 1 }).toString(),
    initialBalance: 2355,
    finalBalance: 9450,
    userId: 3,
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
];
