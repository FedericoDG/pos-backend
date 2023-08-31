import { NextFunction, Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';

import { asyncHandler } from '../helpers/asyncHandler';
// import { bcHash } from '../helpers/bcrypt';
import { endpointResponse } from '../helpers/endpointResponse';

import { CreateClientType, UpdateClientType } from '../schemas/client.schema';

const prisma = new PrismaClient();

export const getAll = asyncHandler(
  async (_req: Request<unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const clients = await prisma.clients.findMany({
        include: { identification: true, ivaType: true },
        orderBy: [
          {
            updatedAt: 'desc',
          },
        ],
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Clientes recuperados',
        body: {
          clients,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Clients - GET ALL]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const getById = asyncHandler(
  async (req: Request<{ id?: number }, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const client = await prisma.clients.findFirst({
        where: { id: Number(id) },
        include: { identification: true, ivaType: true },
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Cliente recuperado',
        body: {
          client,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Clients - GET ONE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const create = asyncHandler(
  async (req: Request<unknown, unknown, CreateClientType>, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      const client = await prisma.clients.create({ data });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Cliente creado',
        body: {
          client,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Clients - CREATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const update = asyncHandler(
  async (req: Request<{ id?: number }, unknown, UpdateClientType>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, lastname, phone, mobile, address, info, identificationId, document, ivaTypeId } = req.body;

      const data: UpdateClientType = {
        name,
        lastname,
        phone,
        mobile,
        address,
        info,
        identificationId,
        document,
        ivaTypeId,
      };

      /*  if (password) {
        const hashedPassword = await bcHash(password);
        data.password = hashedPassword;
      } */

      const client = await prisma.clients.update({
        where: { id: Number(id) },
        data,
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Cliente actualizado',
        body: {
          client,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Suppliers - UPDATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const remove = asyncHandler(
  async (req: Request<{ id?: number }, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const client = await prisma.clients.delete({
        where: { id: Number(id) },
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Proveedor eliminado',
        body: {
          client,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Clients - DELETE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);
