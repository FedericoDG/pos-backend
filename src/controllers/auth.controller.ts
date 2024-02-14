import { NextFunction, Response, Request } from 'express';
import createHttpError from 'http-errors';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';
import { jwtSign } from '../helpers/jwt';
import { PrismaClient } from '@prisma/client';

import { LoginType } from '../schemas/auth.schema';

const prisma = new PrismaClient();

export const login = asyncHandler(
  async (req: Request<unknown, unknown, LoginType>, res: Response, next: NextFunction) => {
    try {
      const { user } = req;
      const token = jwtSign(user);

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Login exitoso',
        body: {
          user,
          token,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Auth - LOGIN]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const loginDriver = asyncHandler(
  async (req: Request<unknown, unknown, LoginType>, res: Response, next: NextFunction) => {
    try {
      // USER
      const { user } = req;
      const token = jwtSign(user);

      // WAREHOUSE
      const warehouse = await prisma.warehouses.findFirst({
        where: { userId: Number(user.id) },
        include: { user: true },
        orderBy: [
          {
            id: 'asc',
          },
        ],
      });

      // CLIENTS
      const clients = await prisma.clients.findMany({
        include: { identification: true, ivaType: true, state: true },
        orderBy: [
          {
            updatedAt: 'desc',
          },
        ],
      });

      // PRICELIST
      const pricelists = await prisma.pricelists.findMany({
        orderBy: [
          {
            updatedAt: 'asc',
          },
        ],
      });

      // INVOICE TYPES
      const invoceTypes = await prisma.invoceTypes.findMany();

      // AFIP SETTINGS
      const afip = await prisma.afip.findFirst({ where: { id: 1 } });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Login exitoso',
        body: {
          user,
          token,
          warehouse,
          clients,
          pricelists,
          invoceTypes,
          afip,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Auth - LOGIN DRIVER]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const loginClient = asyncHandler(
  async (req: Request<unknown, unknown, LoginType>, res: Response, next: NextFunction) => {
    try {
      const { client } = req;
      const token = jwtSign(client);

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Login exitoso',
        body: {
          client,
          token,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Auth - LOGIN CLIENT]: ${error.message}`);
        next(httpError);
      }
    }
  },
);
