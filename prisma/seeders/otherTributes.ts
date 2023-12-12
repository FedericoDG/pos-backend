import { DateTime } from 'luxon';

const now = DateTime.now();

export const otherTributes = [
  {
    code: '01',
    description: 'IMPUESTOS NACIONALES',
    observation: '',
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
  {
    code: '02',
    description: 'IMPUESTOS PROVINCIALES',
    observation: '',
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
  {
    code: '03',
    description: 'IMPUESTOS MUNICIPALES',
    observation: '',
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
  {
    code: '04',
    description: 'IMPUESTOS INTERNOS',
    observation: '',
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
  {
    code: '05',
    description: 'IIBB',
    observation: '',
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
  {
    code: '06',
    description: 'PERCEPCIÓN DE IVA',
    observation: '',
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
  {
    code: '07',
    description: 'PERCEPCIÓN DE IIBB',
    observation: '',
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
  {
    code: '08',
    description: 'PERCEPCIONES POR IMPUESTOS MUNICIPALES',
    observation: '',
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
  {
    code: '09',
    description: 'OTRAS PERCEPCIONES',
    observation: '',
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
  /*   {
    code: '10',
    description: 'IMPUESTO INTERNO A NIVEL ITEM',
    observation: 'SÓLO CONTROLADORES FISCALES',
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  }, */
  {
    code: '13',
    description: 'PERCEPCIÓN DE IVA A NO CATEGORIZADO',
    observation: 'SÓLO FE',
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
  /* {
    code: '14',
    description: 'RETENCIÓN IIGG - RG 830',
    observation: 'LIQUIDACIONES PECUARIAS',
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
  {
    code: '15',
    description: 'RETENCIÓN IVA - RG 3873',
    observation: 'LIQUIDACIONES PECUARIAS',
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
  {
    code: '16',
    description: 'PAGO A CUENTA IVA - RG 3873',
    observation: 'LIQUIDACIONES PECUARIAS',
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
  {
    code: '17',
    description: 'PERCEPCIÓN IVA - RG 3873',
    observation: 'LIQUIDACIONES PECUARIAS',
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
  {
    code: '18',
    description: 'RETENCIÓN IVA - RG 2616/2009',
    observation: 'LIQUIDACIONES PECUARIAS',
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
  {
    code: '19',
    description: 'RETENCIÓN GANANCIAS - RG 2616/2009',
    observation: 'LIQUIDACIONES PECUARIAS',
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  }, */
  {
    code: '99',
    description: 'OTROS',
    observation: '',
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
];
