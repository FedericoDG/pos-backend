import { DateTime } from 'luxon';

const now = DateTime.now();

export const pricelists = [
  {
    code: 'Mayorista',
    description: 'Lista de precios mayorista',
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
  {
    code: 'Minorista',
    description: 'Lista de precios minorista',
    createdAt: now.plus({ seconds: 2 }).toString(),
    updatedAt: now.plus({ seconds: 2 }).toString(),
  },
  {
    code: 'Lista n° 3',
    description: 'Lista de precios n° 3',
    createdAt: now.plus({ seconds: 3 }).toString(),
    updatedAt: now.plus({ seconds: 3 }).toString(),
  },
];
