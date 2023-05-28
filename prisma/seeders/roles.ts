import { UserType } from '@prisma/client';

export const roles = [
  {
    name: UserType.SUPERADMIN,
  },
  {
    name: UserType.ADMIN,
  },
  {
    name: UserType.VENDOR,
  },
  {
    name: UserType.USER,
  },
  {
    name: UserType.CLIENT,
  },
];
