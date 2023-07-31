import { DateTime } from 'luxon';

const now = DateTime.now();

export const users = [
  {
    name: 'Federico',
    lastname: 'González',
    email: 'superadmin@gmail.com',
    password: '$2a$10$ZM6gFPu6tMAU4wr79TFDn.2IZbon0i/iGeNygxtGxdnVqEz1jkr4q',
    roleId: 1,
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
  {
    name: 'Francisco',
    lastname: 'Paniagua',
    email: 'admin@gmail.com',
    password: '$2a$10$ZM6gFPu6tMAU4wr79TFDn.2IZbon0i/iGeNygxtGxdnVqEz1jkr4q',
    roleId: 2,
    createdAt: now.plus({ minutes: 2 }).toString(),
    updatedAt: now.plus({ minutes: 2 }).toString(),
  },
  {
    name: 'Daniel',
    lastname: 'Gaía',
    email: 'seller@gmail.com',
    password: '$2a$10$ZM6gFPu6tMAU4wr79TFDn.2IZbon0i/iGeNygxtGxdnVqEz1jkr4q',
    roleId: 3,
    createdAt: now.plus({ minutes: 3 }).toString(),
    updatedAt: now.plus({ minutes: 3 }).toString(),
  },
  {
    name: 'Roberto',
    lastname: 'Quintana',
    email: 'driver@gmail.com',
    password: '$2a$10$ZM6gFPu6tMAU4wr79TFDn.2IZbon0i/iGeNygxtGxdnVqEz1jkr4q',
    roleId: 4,
    createdAt: now.plus({ minutes: 4 }).toString(),
    updatedAt: now.plus({ minutes: 4 }).toString(),
  },
];
