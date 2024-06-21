import { DateTime } from 'luxon';

const now = DateTime.now();

export const settings = [
  {
    name: 'Delivery Hero Stores S.A.',
    address: 'Av. Brasil, 123',
    cp: '5000',
    province: 'Córdoba',
    cuit: '30-15128459-9',
    start: '01/01/2000',
    invoceName: 'Presupuesto',
    invoceNumber: 3,
    imageURL: 'https://live.pystatic.com/webassets/pwa/icons/icon-384x384.png',
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
];
