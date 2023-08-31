import { DateTime } from 'luxon';

const now = DateTime.now();

export const ivaType = [
  {
    code: '1',
    description: 'IVA RESPONSABLE INSCRIPTO',
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
  {
    code: '2',
    description: 'IVA RESPONSABLE NO INSCRIPTO',
    createdAt: now.plus({ minutes: 2 }).toString(),
    updatedAt: now.plus({ minutes: 2 }).toString(),
  },
  {
    code: '3',
    description: 'IVA NO RESPONSABLE',
    createdAt: now.plus({ minutes: 3 }).toString(),
    updatedAt: now.plus({ minutes: 3 }).toString(),
  },
  {
    code: '4',
    description: 'IVA SUJETO EXENTO',
    createdAt: now.plus({ minutes: 4 }).toString(),
    updatedAt: now.plus({ minutes: 4 }).toString(),
  },
  {
    code: '5',
    description: 'CONSUMIDOR FINAL',
    createdAt: now.plus({ minutes: 5 }).toString(),
    updatedAt: now.plus({ minutes: 5 }).toString(),
  },
  {
    code: '6',
    description: 'RESPONSABLE MONOTRIBUTO',
    createdAt: now.plus({ minutes: 6 }).toString(),
    updatedAt: now.plus({ minutes: 6 }).toString(),
  },
  {
    code: '7',
    description: 'SUJETO NO CATEGORIZADO',
    createdAt: now.plus({ minutes: 7 }).toString(),
    updatedAt: now.plus({ minutes: 7 }).toString(),
  },
  {
    code: '8',
    description: 'PROVEEDOR DEL EXTERIOR',
    createdAt: now.plus({ minutes: 8 }).toString(),
    updatedAt: now.plus({ minutes: 8 }).toString(),
  },
  {
    code: '9',
    description: 'CLIENTE DEL EXTERIOR',
    createdAt: now.plus({ minutes: 9 }).toString(),
    updatedAt: now.plus({ minutes: 9 }).toString(),
  },
  {
    code: '10',
    description: 'IVA LIBERADO - LEY Nº 19640',
    createdAt: now.plus({ minutes: 10 }).toString(),
    updatedAt: now.plus({ minutes: 10 }).toString(),
  },
  {
    code: '11',
    description: 'IVA RESPONSABLE INSCRIPTO - AGENTE DE PERCEPCIÓN',
    createdAt: now.plus({ minutes: 11 }).toString(),
    updatedAt: now.plus({ minutes: 11 }).toString(),
  },
  {
    code: '12',
    description: 'PEQUEÑO CONTRIBUYENTE EVENTUAL',
    createdAt: now.plus({ minutes: 12 }).toString(),
    updatedAt: now.plus({ minutes: 12 }).toString(),
  },
  {
    code: '13',
    description: 'MONOTRIBUTISTA EVENTUAL',
    createdAt: now.plus({ minutes: 13 }).toString(),
    updatedAt: now.plus({ minutes: 13 }).toString(),
  },
  {
    code: '14',
    description: 'PEQUEÑO CONTRIBUYENTE EVENTUAL SOCIAL',
    createdAt: now.plus({ minutes: 14 }).toString(),
    updatedAt: now.plus({ minutes: 14 }).toString(),
  },
];
