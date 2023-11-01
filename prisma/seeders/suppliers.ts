import { DateTime } from 'luxon';

const now = DateTime.now();

export const suppliers = [
  {
    cuit: '11111111111',
    name: 'Proveedor Uno',
    email: 'proveedoruno@gmail.com',
    phone: '3514258258',
    mobile: '3516114150',
    address: '24 de Septiembre 358',
    info: '',
    createdAt: now.plus({ seconds: 1 }).toString(),
    updatedAt: now.plus({ seconds: 1 }).toString(),
  },
  {
    cuit: '22222222222',
    name: 'Proveedor Dos',
    email: 'proveedordos@gmail.com',
    phone: '3514920499',
    mobile: '',
    address: 'Viamonte 879',
    info: '',
    createdAt: now.plus({ seconds: 2 }).toString(),
    updatedAt: now.plus({ seconds: 2 }).toString(),
  },
];
