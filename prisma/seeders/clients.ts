import { DateTime } from 'luxon';

const now = DateTime.now();

export const clients = [
  {
    name: 'Consumidor',
    lastname: 'Final',
    identificationId: 36,
    document: '00000000',
    email: 'consumidorfinal@gmail.com',
    password: '$2a$10$ZM6gFPu6tMAU4wr79TFDn.2IZbon0i/iGeNygxtGxdnVqEz1jkr4q',
    phone: '',
    mobile: '',
    address: '',
    info: '',
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
  {
    name: 'Juan Carlos',
    lastname: 'Pérez',
    identificationId: 35,
    document: '10239367',
    email: 'juancarlosperez@gmail.com',
    password: '$2a$10$ZM6gFPu6tMAU4wr79TFDn.2IZbon0i/iGeNygxtGxdnVqEz1jkr4q',
    phone: '',
    mobile: '3517564940',
    address: '',
    info: '',
    createdAt: now.plus({ minutes: 2 }).toString(),
    updatedAt: now.plus({ minutes: 2 }).toString(),
  },
];
