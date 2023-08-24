import { DateTime } from 'luxon';

const now = DateTime.now();

export const costs = [
  {
    productId: 1,
    price: 480.35,
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
  {
    productId: 2,
    price: 510.5,
    createdAt: now.plus({ minutes: 2 }).toString(),
    updatedAt: now.plus({ minutes: 2 }).toString(),
  },
  {
    productId: 3,
    price: 98,
    createdAt: now.plus({ minutes: 3 }).toString(),
    updatedAt: now.plus({ minutes: 3 }).toString(),
  },
  {
    productId: 3,
    price: 120.3,
    createdAt: now.plus({ minutes: 4 }).toString(),
    updatedAt: now.plus({ minutes: 4 }).toString(),
  },
  {
    productId: 4,
    price: 410.15,
    createdAt: now.plus({ minutes: 5 }).toString(),
    updatedAt: now.plus({ minutes: 5 }).toString(),
  },
  {
    productId: 5,
    price: 499.95,
    createdAt: now.plus({ minutes: 6 }).toString(),
    updatedAt: now.plus({ minutes: 6 }).toString(),
  },
  {
    productId: 6,
    price: 278,
    createdAt: now.plus({ minutes: 7 }).toString(),
    updatedAt: now.plus({ minutes: 7 }).toString(),
  },
  {
    productId: 7,
    price: 587.6,
    createdAt: now.plus({ minutes: 8 }).toString(),
    updatedAt: now.plus({ minutes: 8 }).toString(),
  },
  {
    productId: 8,
    price: 474.4,
    createdAt: now.plus({ minutes: 9 }).toString(),
    updatedAt: now.plus({ minutes: 9 }).toString(),
  },
  {
    productId: 8,
    price: 484.4,
    createdAt: now.plus({ minutes: 10 }).toString(),
    updatedAt: now.plus({ minutes: 10 }).toString(),
  },
  {
    productId: 9,
    price: 530.4,
    createdAt: now.plus({ minutes: 10 }).toString(),
    updatedAt: now.plus({ minutes: 10 }).toString(),
  },
  {
    productId: 10,
    price: 499.4,
    createdAt: now.plus({ minutes: 10 }).toString(),
    updatedAt: now.plus({ minutes: 10 }).toString(),
  },
  {
    productId: 11,
    price: 608.1,
    createdAt: now.plus({ minutes: 10 }).toString(),
    updatedAt: now.plus({ minutes: 10 }).toString(),
  },
  {
    productId: 12,
    price: 610.15,
    createdAt: now.plus({ minutes: 10 }).toString(),
    updatedAt: now.plus({ minutes: 10 }).toString(),
  },
];
