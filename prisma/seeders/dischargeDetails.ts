import { DateTime } from 'luxon';

const now = DateTime.now();

export const dischargeDetails = [
  {
    dischargeId: 1,
    productId: 4,
    quantity: 3,
    cost: 480.35,
    reasonId: 1,
    info: 'Entraron a robar',
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
];
