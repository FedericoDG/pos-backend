import { DateTime } from 'luxon';

const now = DateTime.now();

export const units = [
  {
    name: 'Unidades',
    code: 'Un.',
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
  {
    name: 'Kilogramos',
    code: 'Kg.',
    createdAt: now.plus({ minutes: 2 }).toString(),
    updatedAt: now.plus({ minutes: 2 }).toString(),
  },
  {
    name: 'Docena',
    code: 'Doc.',
    createdAt: now.plus({ minutes: 3 }).toString(),
    updatedAt: now.plus({ minutes: 3 }).toString(),
  },
  {
    name: 'Litro',
    code: 'Lts.',
    createdAt: now.plus({ minutes: 4 }).toString(),
    updatedAt: now.plus({ minutes: 4 }).toString(),
  },
];
