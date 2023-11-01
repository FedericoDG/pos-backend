import { DateTime } from 'luxon';

const now = DateTime.now();

export const categories = [
  {
    name: 'General',
    description: 'productos generales',
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
  {
    name: 'Frutas',
    description: '',
    createdAt: now.plus({ seconds: 2 }).toString(),
    updatedAt: now.plus({ seconds: 2 }).toString(),
  },
  {
    name: 'Verduras',
    description: '',
    createdAt: now.plus({ seconds: 3 }).toString(),
    updatedAt: now.plus({ seconds: 3 }).toString(),
  },
  {
    name: 'Huevos y Lácteos',
    description: '',
    createdAt: now.plus({ seconds: 4 }).toString(),
    updatedAt: now.plus({ seconds: 4 }).toString(),
  },
];
