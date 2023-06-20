import { DateTime } from 'luxon';

const now = DateTime.now();

export const dischargeDetails = [
  {
    dischargeId: 1,
    productId: 4,
    quantity: 10,
    reasonId: 1,
    info: 'Entraron a robar',
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
];
