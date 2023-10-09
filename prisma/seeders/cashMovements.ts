import { DateTime } from 'luxon';

const now = DateTime.now();

export const cashMovements = [
  {
    cashRegisterId: 1,
    subtotal: 9770.25,
    total: 9770.25,
    warehouseId: 1,
    clientId: 2,
    userId: 3,
    invoceTypeId: 4,
    posNumber: 1,
    invoceNumber: 1,
    iva: false,
    info: '',
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
  {
    cashRegisterId: 2,
    subtotal: 9770.25,
    total: 9770.25,
    warehouseId: 3,
    clientId: 2,
    userId: 4,
    invoceTypeId: 4,
    posNumber: 1,
    invoceNumber: 2,
    iva: false,
    info: '',
    createdAt: now.plus({ minutes: 2 }).toString(),
    updatedAt: now.plus({ minutes: 2 }).toString(),
  },
  /*  {
    cashRegisterId: 1,
    subtotal: 9770.25,
    recharge: 0,
    discount: 970,
    otherTributes: 0,
    total: 8800.25,
    warehouseId: 1,
    clientId: 2,
    userId: 3,
    invoceTypeId: 1,
    posNumber: 1,
    invoceNumber: 1,
    iva: true,
    info: '',
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
  {
    cashRegisterId: 2,
    subtotal: 9770.25,
    recharge: 0,
    discount: 0,
    otherTributes: 0,
    total: 9770.25,
    warehouseId: 3,
    clientId: 2,
    userId: 4,
    invoceTypeId: 2,
    posNumber: 1,
    invoceNumber: 2,
    iva: true,
    info: '',
    createdAt: now.plus({ minutes: 2 }).toString(),
    updatedAt: now.plus({ minutes: 2 }).toString(),
  }, */
];
