import { UserType } from '@prisma/client';

export const roles = [
  {
    name: UserType.SUPERADMIN,
  },
  {
    name: UserType.ADMIN,
  },
  {
    name: UserType.SELLER,
  },
  {
    name: UserType.USER,
  },
  {
    name: UserType.CLIENT,
  },
];
