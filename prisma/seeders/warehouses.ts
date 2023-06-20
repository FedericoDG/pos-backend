import { DateTime } from 'luxon';

const now = DateTime.now();

export const warehouses = [
  {
    code: 'depo-01',
    description: 'depósito n° 1',
    address: 'San Martín 155',
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
  {
    code: 'depo-02',
    description: 'depósito n° 2',
    address: '9 de Julio 530',
    createdAt: now.plus({ minutes: 2 }).toString(),
    updatedAt: now.plus({ minutes: 2 }).toString(),
  },
];
