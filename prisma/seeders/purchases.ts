import { DateTime } from 'luxon';

const now = DateTime.now();

export const purchases = [
  {
    supplierId: 1,
    warehouseId: 1,
    total: 28770,
    date: new Date(),
    driver: 'Carlos Pérez',
    transport: 'Transporte Cruz del Sur',
    userId: 3,
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
];
