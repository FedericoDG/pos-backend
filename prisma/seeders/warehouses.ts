import { DateTime } from 'luxon';

const now = DateTime.now();

export const warehouses = [
  {
    code: 'depo-01',
    description: 'depósito n° 1',
    address: 'San Martín 155',
    userId: 1,
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
  {
    code: 'depo-02',
    description: 'depósito n° 2',
    address: '9 de Julio 530',
    userId: 1,
    createdAt: now.plus({ seconds: 2 }).toString(),
    updatedAt: now.plus({ seconds: 2 }).toString(),
  },
  {
    code: 'chofer-1',
    userId: 4,
    driver: 1,
    createdAt: now.plus({ seconds: 3 }).toString(),
    updatedAt: now.plus({ seconds: 3 }).toString(),
  },
];
