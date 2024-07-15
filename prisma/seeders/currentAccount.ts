import { DateTime } from 'luxon';

const now = DateTime.now();

export const currentAccounts = [
  {
    clientId: 2,
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
];
