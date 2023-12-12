import { DateTime } from 'luxon';

const now = DateTime.now();

export const purchaseDetails = [
  {
    purchaseId: 1,
    productId: 1,
    price: 480.35,
    quantity: 40,
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
  {
    purchaseId: 1,
    productId: 2,
    price: 510.5,
    quantity: 12,
    createdAt: now.plus({ seconds: 2 }).toString(),
    updatedAt: now.plus({ seconds: 2 }).toString(),
  },
  {
    purchaseId: 1,
    productId: 3,
    price: 98,
    quantity: 35,
    createdAt: now.plus({ seconds: 3 }).toString(),
    updatedAt: now.plus({ seconds: 3 }).toString(),
  },
];
