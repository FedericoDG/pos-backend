import { StatusType } from '@prisma/client';

export const products = [
  {
    code: 'tom',
    name: 'tomate redondo',
    barcode: '0123456789012',
    status: StatusType.ENABLED,
    allownegativestock: StatusType.DISABLED,
    categoryId: 1,
    unitId: 1,
  },
  {
    code: 'lechu',
    name: 'lechuga criolla',
    barcode: '1234567890123',
    status: StatusType.ENABLED,
    allownegativestock: StatusType.DISABLED,
    categoryId: 1,
    unitId: 1,
  },
];
