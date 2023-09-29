import { DateTime } from 'luxon';

const now = DateTime.now();

export const invoceTypes = [
  {
    code: '001',
    description: 'FACTURA A',
    createdAt: now.plus({ minutes: 1 }).toString(),
    updatedAt: now.plus({ minutes: 1 }).toString(),
  },
  /* {
    code: '002',
    description: 'NOTAS DE DÉBITO A',
    createdAt: now.plus({ minutes: 2 }).toString(),
    updatedAt: now.plus({ minutes: 2 }).toString(),
  },
  {
    code: '003',
    description: 'NOTAS DE CRÉDITO A',
    createdAt: now.plus({ minutes: 3 }).toString(),
    updatedAt: now.plus({ minutes: 3 }).toString(),
  },
  {
    code: '004',
    description: 'RECIBOS A',
    createdAt: now.plus({ minutes: 4 }).toString(),
    updatedAt: now.plus({ minutes: 4 }).toString(),
  },
  {
    code: '005',
    description: 'NOTAS DE VENTA AL CONTADO A',
    createdAt: now.plus({ minutes: 5 }).toString(),
    updatedAt: now.plus({ minutes: 5 }).toString(),
  }, */
  {
    code: '006',
    description: 'FACTURA B',
    createdAt: now.plus({ minutes: 6 }).toString(),
    updatedAt: now.plus({ minutes: 6 }).toString(),
  },
  /* {
    code: '007',
    description: 'NOTAS DE DÉBITO B',
    createdAt: now.plus({ minutes: 7 }).toString(),
    updatedAt: now.plus({ minutes: 7 }).toString(),
  },
  {
    code: '008',
    description: 'NOTAS DE CRÉDITO B',
    createdAt: now.plus({ minutes: 8 }).toString(),
    updatedAt: now.plus({ minutes: 8 }).toString(),
  },
  {
    code: '009',
    description: 'RECIBOS B',
    createdAt: now.plus({ minutes: 9 }).toString(),
    updatedAt: now.plus({ minutes: 9 }).toString(),
  },
  {
    code: '010',
    description: 'NOTAS DE VENTA AL CONTADO B',
    createdAt: now.plus({ minutes: 10 }).toString(),
    updatedAt: now.plus({ minutes: 10 }).toString(),
  },
  {
    code: '011',
    description: 'FACTURAS C',
    createdAt: now.plus({ minutes: 11 }).toString(),
    updatedAt: now.plus({ minutes: 11 }).toString(),
  },
  {
    code: '012',
    description: 'NOTAS DE DÉBITO C',
    createdAt: now.plus({ minutes: 12 }).toString(),
    updatedAt: now.plus({ minutes: 12 }).toString(),
  },
  {
    code: '013',
    description: 'NOTAS DE CRÉDITO C',
    createdAt: now.plus({ minutes: 13 }).toString(),
    updatedAt: now.plus({ minutes: 13 }).toString(),
  },
  {
    code: '015',
    description: 'RECIBOS C',
    createdAt: now.plus({ minutes: 14 }).toString(),
    updatedAt: now.plus({ minutes: 14 }).toString(),
  },
  {
    code: '016',
    description: 'NOTAS DE VENTA AL CONTADO C',
    createdAt: now.plus({ minutes: 15 }).toString(),
    updatedAt: now.plus({ minutes: 15 }).toString(),
  },
  {
    code: '017',
    description: 'LIQUIDACIÓN DE SERVICIOS PÚBLICOS CLASE A',
    createdAt: now.plus({ minutes: 16 }).toString(),
    updatedAt: now.plus({ minutes: 16 }).toString(),
  },
  {
    code: '018',
    description: 'LIQUIDACIÓN DE SERVICIOS PÚBLICOS CLASE B',
    createdAt: now.plus({ minutes: 17 }).toString(),
    updatedAt: now.plus({ minutes: 17 }).toString(),
  },
  {
    code: '019',
    description: 'FACTURAS DE EXPORTACIÓN',
    createdAt: now.plus({ minutes: 18 }).toString(),
    updatedAt: now.plus({ minutes: 18 }).toString(),
  },
  {
    code: '020',
    description: 'NOTAS DE DÉBITO POR OPERACIONES CON EL EXTERIOR',
    createdAt: now.plus({ minutes: 19 }).toString(),
    updatedAt: now.plus({ minutes: 19 }).toString(),
  },
  {
    code: '021',
    description: 'NOTAS DE CRÉDITO POR OPERACIONES CON EL EXTERIOR',
    createdAt: now.plus({ minutes: 20 }).toString(),
    updatedAt: now.plus({ minutes: 20 }).toString(),
  },
  {
    code: '022',
    description: 'FACTURAS - PERMISO EXPORTACIÓN SIMPLIFICADO - DTO. 855/97',
    createdAt: now.plus({ minutes: 21 }).toString(),
    updatedAt: now.plus({ minutes: 21 }).toString(),
  },
  {
    code: '023',
    description: 'COMPROBANTES “A” DE COMPRA PRIMARIA PARA EL SECTOR PESQUERO MARÍTIMO',
    createdAt: now.plus({ minutes: 22 }).toString(),
    updatedAt: now.plus({ minutes: 22 }).toString(),
  },
  {
    code: '024',
    description: 'COMPROBANTES “A” DE CONSIGNACIÓN PRIMARIA PARA EL SECTOR PESQUERO MARÍTIMO',
    createdAt: now.plus({ minutes: 23 }).toString(),
    updatedAt: now.plus({ minutes: 23 }).toString(),
  },
  {
    code: '025',
    description: 'COMPROBANTES “B” DE COMPRA PRIMARIA PARA EL SECTOR PESQUERO MARÍTIMO',
    createdAt: now.plus({ minutes: 24 }).toString(),
    updatedAt: now.plus({ minutes: 24 }).toString(),
  },
  {
    code: '026',
    description: 'COMPROBANTES “B” DE CONSIGNACIÓN PRIMARIA PARA EL SECTOR PESQUERO MARÍTIMO',
    createdAt: now.plus({ minutes: 25 }).toString(),
    updatedAt: now.plus({ minutes: 25 }).toString(),
  },
  {
    code: '027',
    description: 'LIQUIDACIÓN ÚNICA COMERCIAL IMPOSITIVA CLASE A',
    createdAt: now.plus({ minutes: 26 }).toString(),
    updatedAt: now.plus({ minutes: 26 }).toString(),
  },
  {
    code: '028',
    description: 'LIQUIDACIÓN ÚNICA COMERCIAL IMPOSITIVA CLASE B',
    createdAt: now.plus({ minutes: 27 }).toString(),
    updatedAt: now.plus({ minutes: 27 }).toString(),
  },
  {
    code: '029',
    description: 'LIQUIDACIÓN ÚNICA COMERCIAL IMPOSITIVA CLASE C',
    createdAt: now.plus({ minutes: 28 }).toString(),
    updatedAt: now.plus({ minutes: 28 }).toString(),
  },
  {
    code: '030',
    description: 'COMPROBANTES DE COMPRA DE BIENES USADOS',
    createdAt: now.plus({ minutes: 29 }).toString(),
    updatedAt: now.plus({ minutes: 29 }).toString(),
  },
  {
    code: '031',
    description: 'MANDATO - CONSIGNACIÓN',
    createdAt: now.plus({ minutes: 30 }).toString(),
    updatedAt: now.plus({ minutes: 30 }).toString(),
  },
  {
    code: '032',
    description: 'COMPROBANTES PARA RECICLAR MATERIALES',
    createdAt: now.plus({ minutes: 31 }).toString(),
    updatedAt: now.plus({ minutes: 31 }).toString(),
  },
  {
    code: '033',
    description: 'LIQUIDACIÓN PRIMARIA DE GRANOS',
    createdAt: now.plus({ minutes: 32 }).toString(),
    updatedAt: now.plus({ minutes: 32 }).toString(),
  },
  {
    code: '034',
    description: 'COMPROBANTES A DEL APARTADO A INCISO F) R.G. N° 1415',
    createdAt: now.plus({ minutes: 33 }).toString(),
    updatedAt: now.plus({ minutes: 33 }).toString(),
  },
  {
    code: '035',
    description: 'COMPROBANTES B DEL ANEXO I, APARTADO A, INC. F), R.G. N° 1415',
    createdAt: now.plus({ minutes: 34 }).toString(),
    updatedAt: now.plus({ minutes: 34 }).toString(),
  },
  {
    code: '036',
    description: 'COMPROBANTES C DEL ANEXO I, APARTADO A, INC.F), R.G. N° 1415',
    createdAt: now.plus({ minutes: 35 }).toString(),
    updatedAt: now.plus({ minutes: 35 }).toString(),
  },
  {
    code: '037',
    description: 'NOTAS DE DÉBITO O DOCUMENTO EQUIVALENTE QUE CUMPLAN CON LA R.G. N° 1415',
    createdAt: now.plus({ minutes: 36 }).toString(),
    updatedAt: now.plus({ minutes: 36 }).toString(),
  },
  {
    code: '038',
    description: 'NOTAS DE CRÉDITO O DOCUMENTO EQUIVALENTE QUE CUMPLAN CON LA R.G. N° 1415',
    createdAt: now.plus({ minutes: 37 }).toString(),
    updatedAt: now.plus({ minutes: 37 }).toString(),
  },
  {
    code: '039',
    description: 'OTROS COMPROBANTES A QUE CUMPLEN CON LA R G 1415',
    createdAt: now.plus({ minutes: 38 }).toString(),
    updatedAt: now.plus({ minutes: 38 }).toString(),
  },
  {
    code: '040',
    description: 'OTROS COMPROBANTES B QUE CUMPLAN CON LA R.G. N° 1415',
    createdAt: now.plus({ minutes: 39 }).toString(),
    updatedAt: now.plus({ minutes: 39 }).toString(),
  },
  {
    code: '041',
    description: 'OTROS COMPROBANTES C QUE CUMPLAN CON LA R.G. N° 1415',
    createdAt: now.plus({ minutes: 40 }).toString(),
    updatedAt: now.plus({ minutes: 40 }).toString(),
  },
  {
    code: '043',
    description: 'NOTA DE CRÉDITO LIQUIDACIÓN ÚNICA COMERCIAL IMPOSITIVA CLASE B',
    createdAt: now.plus({ minutes: 41 }).toString(),
    updatedAt: now.plus({ minutes: 41 }).toString(),
  },
  {
    code: '044',
    description: 'NOTA DE CRÉDITO LIQUIDACIÓN ÚNICA COMERCIAL IMPOSITIVA CLASE C',
    createdAt: now.plus({ minutes: 42 }).toString(),
    updatedAt: now.plus({ minutes: 42 }).toString(),
  },
  {
    code: '045',
    description: 'NOTA DE DÉBITO LIQUIDACIÓN ÚNICA COMERCIAL IMPOSITIVA CLASE A',
    createdAt: now.plus({ minutes: 43 }).toString(),
    updatedAt: now.plus({ minutes: 43 }).toString(),
  },
  {
    code: '046',
    description: 'NOTA DE DÉBITO LIQUIDACIÓN ÚNICA COMERCIAL IMPOSITIVA CLASE B',
    createdAt: now.plus({ minutes: 44 }).toString(),
    updatedAt: now.plus({ minutes: 44 }).toString(),
  },
  {
    code: '047',
    description: 'NOTA DE DEBITO LIQUIDACION ÚNICA COMERCIAL IMPOSITIVA CLASE C',
    createdAt: now.plus({ minutes: 45 }).toString(),
    updatedAt: now.plus({ minutes: 45 }).toString(),
  },
  {
    code: '048',
    description: 'NOTA DE CRÉDITO LIQUIDACIÓN ÚNICA COMERCIAL IMPOSITIVA CLASE A',
    createdAt: now.plus({ minutes: 46 }).toString(),
    updatedAt: now.plus({ minutes: 46 }).toString(),
  },
  {
    code: '049',
    description: 'COMPROBANTES DE COMPRA DE BIENES NO REGISTRABLES A CONSUMIDORES FINALES',
    createdAt: now.plus({ minutes: 47 }).toString(),
    updatedAt: now.plus({ minutes: 47 }).toString(),
  },
  {
    code: '050',
    description: 'RECIBO FACTURA A REGIMEN DE FACTURA DE CRÉDITO',
    createdAt: now.plus({ minutes: 48 }).toString(),
    updatedAt: now.plus({ minutes: 48 }).toString(),
  },*/
  {
    code: '051',
    description: 'FACTURA M',
    createdAt: now.plus({ minutes: 49 }).toString(),
    updatedAt: now.plus({ minutes: 49 }).toString(),
  } /*
  {
    code: '052',
    description: 'NOTAS DE DÉBITO M',
    createdAt: now.plus({ minutes: 50 }).toString(),
    updatedAt: now.plus({ minutes: 50 }).toString(),
  },
  {
    code: '053',
    description: 'NOTAS DE CRÉDITO M',
    createdAt: now.plus({ minutes: 51 }).toString(),
    updatedAt: now.plus({ minutes: 51 }).toString(),
  },
  {
    code: '054',
    description: 'RECIBOS M',
    createdAt: now.plus({ minutes: 52 }).toString(),
    updatedAt: now.plus({ minutes: 52 }).toString(),
  },
  {
    code: '055',
    description: 'NOTAS DE VENTA AL CONTADO M',
    createdAt: now.plus({ minutes: 53 }).toString(),
    updatedAt: now.plus({ minutes: 53 }).toString(),
  },
  {
    code: '056',
    description: 'COMPROBANTES M DEL ANEXO I APARTADO A INC F) R.G. N° 1415',
    createdAt: now.plus({ minutes: 54 }).toString(),
    updatedAt: now.plus({ minutes: 54 }).toString(),
  },
  {
    code: '057',
    description: 'OTROS COMPROBANTES M QUE CUMPLAN CON LA R.G. N° 1415',
    createdAt: now.plus({ minutes: 55 }).toString(),
    updatedAt: now.plus({ minutes: 55 }).toString(),
  },
  {
    code: '058',
    description: 'CUENTAS DE VENTA Y LÍQUIDO PRODUCTO M',
    createdAt: now.plus({ minutes: 56 }).toString(),
    updatedAt: now.plus({ minutes: 56 }).toString(),
  },
  {
    code: '059',
    description: 'LIQUIDACIONES M',
    createdAt: now.plus({ minutes: 57 }).toString(),
    updatedAt: now.plus({ minutes: 57 }).toString(),
  },
  {
    code: '060',
    description: 'CUENTAS DE VENTA Y LÍQUIDO PRODUCTO A',
    createdAt: now.plus({ minutes: 58 }).toString(),
    updatedAt: now.plus({ minutes: 58 }).toString(),
  },
  {
    code: '061',
    description: 'CUENTAS DE VENTA Y LÍQUIDO PRODUCTO B',
    createdAt: now.plus({ minutes: 59 }).toString(),
    updatedAt: now.plus({ minutes: 59 }).toString(),
  },
  {
    code: '063',
    description: 'LIQUIDACIONES A',
    createdAt: now.plus({ minutes: 60 }).toString(),
    updatedAt: now.plus({ minutes: 60 }).toString(),
  },
  {
    code: '064',
    description: 'LIQUIDACIONES B',
    createdAt: now.plus({ minutes: 61 }).toString(),
    updatedAt: now.plus({ minutes: 61 }).toString(),
  },
  {
    code: '066',
    description: 'DESPACHO DE IMPORTACIÓN',
    createdAt: now.plus({ minutes: 62 }).toString(),
    updatedAt: now.plus({ minutes: 62 }).toString(),
  },
  {
    code: '068',
    description: 'LIQUIDACIÓN C',
    createdAt: now.plus({ minutes: 63 }).toString(),
    updatedAt: now.plus({ minutes: 63 }).toString(),
  },
  {
    code: '070',
    description: 'RECIBOS FACTURA DE CRÉDITO',
    createdAt: now.plus({ minutes: 64 }).toString(),
    updatedAt: now.plus({ minutes: 64 }).toString(),
  },
  {
    code: '080',
    description: 'INFORME DIARIO DE CIERRE (ZETA) - CONTROLADORES FISCALES',
    createdAt: now.plus({ minutes: 65 }).toString(),
    updatedAt: now.plus({ minutes: 65 }).toString(),
  },
  {
    code: '081',
    description: 'TIQUE FACTURA A',
    createdAt: now.plus({ minutes: 66 }).toString(),
    updatedAt: now.plus({ minutes: 66 }).toString(),
  },
  {
    code: '082',
    description: 'TIQUE FACTURA B',
    createdAt: now.plus({ minutes: 67 }).toString(),
    updatedAt: now.plus({ minutes: 67 }).toString(),
  },
  {
    code: '083',
    description: 'TIQUE',
    createdAt: now.plus({ minutes: 68 }).toString(),
    updatedAt: now.plus({ minutes: 68 }).toString(),
  },
  {
    code: '088',
    description: 'REMITO ELECTRÓNICO',
    createdAt: now.plus({ minutes: 69 }).toString(),
    updatedAt: now.plus({ minutes: 69 }).toString(),
  },
  {
    code: '089',
    description: 'RESUMEN DE DATOS',
    createdAt: now.plus({ minutes: 70 }).toString(),
    updatedAt: now.plus({ minutes: 70 }).toString(),
  },
  {
    code: '090',
    description: 'OTROS COMPROBANTES - DOCUMENTOS EXCEPTUADOS - NOTAS DE CRÉDITO',
    createdAt: now.plus({ minutes: 71 }).toString(),
    updatedAt: now.plus({ minutes: 71 }).toString(),
  },
  {
    code: '091',
    description: 'REMITOS R',
    createdAt: now.plus({ minutes: 72 }).toString(),
    updatedAt: now.plus({ minutes: 72 }).toString(),
  },
  {
    code: '099',
    description: 'OTROS COMPROBANTES QUE NO CUMPLEN O ESTÁN EXCEPTUADOS DE LA R.G. 1415 Y SUS MODIF',
    createdAt: now.plus({ minutes: 73 }).toString(),
    updatedAt: now.plus({ minutes: 73 }).toString(),
  },
  {
    code: '110',
    description: 'TIQUE NOTA DE CRÉDITO',
    createdAt: now.plus({ minutes: 74 }).toString(),
    updatedAt: now.plus({ minutes: 74 }).toString(),
  },
  {
    code: '111',
    description: 'TIQUE FACTURA C',
    createdAt: now.plus({ minutes: 75 }).toString(),
    updatedAt: now.plus({ minutes: 75 }).toString(),
  },
  {
    code: '112',
    description: 'TIQUE NOTA DE CRÉDITO A',
    createdAt: now.plus({ minutes: 76 }).toString(),
    updatedAt: now.plus({ minutes: 76 }).toString(),
  },
  {
    code: '113',
    description: 'TIQUE NOTA DE CRÉDITO B',
    createdAt: now.plus({ minutes: 77 }).toString(),
    updatedAt: now.plus({ minutes: 77 }).toString(),
  },
  {
    code: '114',
    description: 'TIQUE NOTA DE CRÉDITO C',
    createdAt: now.plus({ minutes: 78 }).toString(),
    updatedAt: now.plus({ minutes: 78 }).toString(),
  },
  {
    code: '115',
    description: 'TIQUE NOTA DE DÉBITO A',
    createdAt: now.plus({ minutes: 79 }).toString(),
    updatedAt: now.plus({ minutes: 79 }).toString(),
  },
  {
    code: '116',
    description: 'TIQUE NOTA DE DÉBITO B',
    createdAt: now.plus({ minutes: 80 }).toString(),
    updatedAt: now.plus({ minutes: 80 }).toString(),
  },
  {
    code: '117',
    description: 'TIQUE NOTA DE DÉBITO C',
    createdAt: now.plus({ minutes: 81 }).toString(),
    updatedAt: now.plus({ minutes: 81 }).toString(),
  },
  {
    code: '118',
    description: 'TIQUE FACTURA M',
    createdAt: now.plus({ minutes: 82 }).toString(),
    updatedAt: now.plus({ minutes: 82 }).toString(),
  },
  {
    code: '119',
    description: 'TIQUE NOTA DE CRÉDITO M',
    createdAt: now.plus({ minutes: 83 }).toString(),
    updatedAt: now.plus({ minutes: 83 }).toString(),
  },
  {
    code: '120',
    description: 'TIQUE NOTA DE DÉBITO M',
    createdAt: now.plus({ minutes: 84 }).toString(),
    updatedAt: now.plus({ minutes: 84 }).toString(),
  },
  {
    code: '201',
    description: 'FACTURA DE CRÉDITO ELECTRÓNICA MiPyMEs (FCE) A',
    createdAt: now.plus({ minutes: 85 }).toString(),
    updatedAt: now.plus({ minutes: 85 }).toString(),
  },
  {
    code: '202',
    description: 'NOTA DE DÉBITO ELECTRÓNICA MiPyMEs (FCE) A',
    createdAt: now.plus({ minutes: 86 }).toString(),
    updatedAt: now.plus({ minutes: 86 }).toString(),
  },
  {
    code: '203',
    description: 'NOTA DE CRÉDITO ELECTRÓNICA MiPyMEs (FCE) A',
    createdAt: now.plus({ minutes: 87 }).toString(),
    updatedAt: now.plus({ minutes: 87 }).toString(),
  },
  {
    code: '206',
    description: 'FACTURA DE CRÉDITO ELECTRÓNICA MiPyMEs (FCE) B',
    createdAt: now.plus({ minutes: 88 }).toString(),
    updatedAt: now.plus({ minutes: 88 }).toString(),
  },
  {
    code: '207',
    description: 'NOTA DE DEBITO ELECTRÓNICA MiPyMEs (FCE) B',
    createdAt: now.plus({ minutes: 89 }).toString(),
    updatedAt: now.plus({ minutes: 89 }).toString(),
  },
  {
    code: '208',
    description: 'NOTA DE CRÉDITO ELECTRÓNICA MiPyMEs (FCE) B',
    createdAt: now.plus({ minutes: 90 }).toString(),
    updatedAt: now.plus({ minutes: 90 }).toString(),
  },
  {
    code: '211',
    description: 'FACTURA DE CRÉDITO ELECTRÓNICA MiPyMEs (FCE) C',
    createdAt: now.plus({ minutes: 91 }).toString(),
    updatedAt: now.plus({ minutes: 91 }).toString(),
  },
  {
    code: '212',
    description: 'NOTA DE DÉBITO ELECTRÓNICA MiPyMEs (FCE) C',
    createdAt: now.plus({ minutes: 92 }).toString(),
    updatedAt: now.plus({ minutes: 92 }).toString(),
  },
  {
    code: '213',
    description: 'NOTA DE CRÉDITO ELECTRÓNICA MiPyMEs (FCE) C',
    createdAt: now.plus({ minutes: 93 }).toString(),
    updatedAt: now.plus({ minutes: 93 }).toString(),
  },
  {
    code: '331',
    description: 'LIQUIDACIÓN SECUNDARIA DE GRANOS',
    createdAt: now.plus({ minutes: 94 }).toString(),
    updatedAt: now.plus({ minutes: 94 }).toString(),
  },
  {
    code: '332',
    description: 'CERTIFICACIÓN ELECTRÓNICA (GRANOS)',
    createdAt: now.plus({ minutes: 95 }).toString(),
    updatedAt: now.plus({ minutes: 95 }).toString(),
  },
  {
    code: '995',
    description: 'REMITO ELECTRÓNICO CÁRNICO',
    createdAt: now.plus({ minutes: 96 }).toString(),
    updatedAt: now.plus({ minutes: 96 }).toString(),
  }, */,
  {
    code: '555',
    description: 'COMPROBANTE X',
    createdAt: now.plus({ minutes: 97 }).toString(),
    updatedAt: now.plus({ minutes: 97 }).toString(),
  },
  {
    code: '003',
    description: 'NOTAS DE CRÉDITO A',
    createdAt: now.plus({ minutes: 98 }).toString(),
    updatedAt: now.plus({ minutes: 98 }).toString(),
  },
  {
    code: '008',
    description: 'NOTAS DE CRÉDITO B',
    createdAt: now.plus({ minutes: 99 }).toString(),
    updatedAt: now.plus({ minutes: 99 }).toString(),
  },
  {
    code: '053',
    description: 'NOTAS DE CRÉDITO M',
    createdAt: now.plus({ minutes: 100 }).toString(),
    updatedAt: now.plus({ minutes: 100 }).toString(),
  },
];
