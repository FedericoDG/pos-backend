import { NextFunction, Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';

import { updateSettingsType } from '../schemas/settings.schema';

const prisma = new PrismaClient();

export const getById = asyncHandler(
  async (req: Request<{ id?: number }, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const settings = await prisma.settings.findFirst({ where: { id: Number(id) } });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Parámetros recuperados',
        body: {
          settings,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Settings - GET ONE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const update = asyncHandler(
  async (req: Request<{ id?: number }, unknown, updateSettingsType>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const settings = await prisma.settings.update({
        where: { id: Number(id) },
        data,
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Parámetros actualizados',
        body: {
          settings,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Settings - UPDATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);
