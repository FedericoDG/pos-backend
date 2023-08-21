import { DateTime } from 'luxon';

const now = DateTime.now();

export const ivaConditions = [
  {
    code: '0',
    description: 'NO CORRESPONDE',
    tax: 0,
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
  {
    code: '1',
    description: 'NO GRAVADO',
    tax: 0,
    createdAt: now.plus({ minutes: 2 }).toString(),
    updatedAt: now.plus({ minutes: 2 }).toString(),
  },
  {
    code: '2',
    description: 'EXENTO',
    tax: 0,
    createdAt: now.plus({ minutes: 3 }).toString(),
    updatedAt: now.plus({ minutes: 3 }).toString(),
  },
  {
    code: '3',
    description: '0 %',
    tax: 0,
    createdAt: now.plus({ minutes: 4 }).toString(),
    updatedAt: now.plus({ minutes: 4 }).toString(),
  },
  {
    code: '4',
    description: '10.50 %',
    tax: 0.105,
    createdAt: now.plus({ minutes: 5 }).toString(),
    updatedAt: now.plus({ minutes: 5 }).toString(),
  },
  {
    code: '5',
    description: '21 %',
    tax: 0.21,
    createdAt: now.plus({ minutes: 6 }).toString(),
    updatedAt: now.plus({ minutes: 6 }).toString(),
  },
  {
    code: '6',
    description: '27 %',
    tax: 0.27,
    createdAt: now.plus({ minutes: 7 }).toString(),
    updatedAt: now.plus({ minutes: 7 }).toString(),
  },
  {
    code: '7',
    description: 'GRAVADO',
    tax: 0,
    createdAt: now.plus({ minutes: 8 }).toString(),
    updatedAt: now.plus({ minutes: 8 }).toString(),
  },
  {
    code: '8',
    description: '5 %',
    tax: 0.05,
    createdAt: now.plus({ minutes: 9 }).toString(),
    updatedAt: now.plus({ minutes: 9 }).toString(),
  },
  {
    code: '9',
    description: '2.50 %',
    tax: 0.025,
    createdAt: now.plus({ minutes: 10 }).toString(),
    updatedAt: now.plus({ minutes: 10 }).toString(),
  },
];
