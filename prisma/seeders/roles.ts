import { UserType } from '@prisma/client';
import { DateTime } from 'luxon';

const now = DateTime.now();

export const roles = [
  {
    name: UserType.SUPERADMIN,
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
  {
    name: UserType.ADMIN,
    createdAt: now.plus({ seconds: 2 }).toString(),
    updatedAt: now.plus({ seconds: 2 }).toString(),
  },
  {
    name: UserType.SELLER,
    createdAt: now.plus({ seconds: 3 }).toString(),
    updatedAt: now.plus({ seconds: 3 }).toString(),
  },
  {
    name: UserType.DRIVER,
    createdAt: now.plus({ seconds: 4 }).toString(),
    updatedAt: now.plus({ seconds: 4 }).toString(),
  },
  {
    name: UserType.CLIENT,
    createdAt: now.plus({ seconds: 5 }).toString(),
    updatedAt: now.plus({ seconds: 5 }).toString(),
  },
];
