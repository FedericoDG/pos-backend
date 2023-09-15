import { NextFunction, Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';
import Afip from '@afipsdk/afip.js';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';

import { afipType } from '../schemas/afip.schema';

const prisma = new PrismaClient();

export const settings = asyncHandler(
  async (_req: Request<unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    const afip = new Afip({ CUIT: process.env.CUIT, cert: './cert.crt', key: './key.key' });
    const settings = await prisma.afip.findFirst({ where: { id: 1 } });

    try {
      const last_voucherA = await afip.ElectronicBilling.getLastVoucher(settings?.posNumber, 1);
      const last_voucherB = await afip.ElectronicBilling.getLastVoucher(settings?.posNumber, 6);
      const last_voucherM = await afip.ElectronicBilling.getLastVoucher(settings?.posNumber, 51);

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Parámetros de AFIP recuperados',
        body: {
          afip: {
            ...settings,
            nextInvoceNumberA: last_voucherA + 1,
            nextInvoceNumberB: last_voucherB + 1,
            nextInvoceNumberM: last_voucherM + 1,
          },
        },
      });
    } catch (error) {
      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Parámetros de AFIP recuperados',
        body: {
          afip: {
            ...settings,
          },
        },
      });
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[AFIP - GET ONE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const update = asyncHandler(async (req: Request<unknown, unknown, afipType>, res: Response) => {
  console.log(req.body);

  endpointResponse({
    res,
    code: 200,
    status: true,
    message: 'AFIP',
    body: {},
  });
});
