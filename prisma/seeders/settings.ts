import { DateTime } from 'luxon';

const now = DateTime.now();

export const settings = [
  {
    name: 'Delivery Hero Stores SA',
    address: 'Av. Brasil, 123',
    cp: '5000',
    province: 'Córdoba',
    ivaCondition: 'Responsable Inscripto',
    cuit: '30-15128459-9',
    posNumber: 1,
    invoceName: 'Presupuesto',
    invoceNumber: 3,
    imageURL: 'https://live.pystatic.com/webassets/pwa/icons/icon-384x384.png',
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
];
