import { DateTime } from 'luxon';

const now = DateTime.now();

export const cashRegisters = [
  {
    openingDate: now.plus({ seconds: 1 }).toString(),
    initialBalance: 2355,
    finalBalance: 9450,
    userId: 1,
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
  {
    openingDate: now.plus({ seconds: 2 }).toString(),
    initialBalance: 2355,
    finalBalance: 9450,
    userId: 2,
    createdAt: now.plus({ seconds: 2 }).toString(),
    updatedAt: now.plus({ seconds: 2 }).toString(),
  },
];
