import { DateTime } from 'luxon';

const now = DateTime.now();

export const units = [
  {
    name: 'Unidades',
    code: 'Un.',
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
  {
    name: 'Kilogramos',
    code: 'Kg.',
    createdAt: now.plus({ seconds: 2 }).toString(),
    updatedAt: now.plus({ seconds: 2 }).toString(),
  },
  {
    name: 'Docena',
    code: 'Doc.',
    createdAt: now.plus({ seconds: 3 }).toString(),
    updatedAt: now.plus({ seconds: 3 }).toString(),
  },
  {
    name: 'Litro',
    code: 'Lts.',
    createdAt: now.plus({ seconds: 4 }).toString(),
    updatedAt: now.plus({ seconds: 4 }).toString(),
  },
];
