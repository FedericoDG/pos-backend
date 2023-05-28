import { NextFunction, Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';
import { UpdateRoleBodyType } from '../schemas/role.schema';

const prisma = new PrismaClient();

export const getAll = asyncHandler(
  async (_req: Request<unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const roles = await prisma.roles.findMany({ include: { users: true, clients: true } });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Roles recuperados',
        body: {
          roles,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Roles - GET ALL]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const getById = asyncHandler(
  async (req: Request<{ id?: number }, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const role = await prisma.roles.findFirst({ where: { id: Number(id) } });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Rol recuperado',
        body: {
          role,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Roles - GET ONE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const update = asyncHandler(
  async (req: Request<{ id?: number }, unknown, UpdateRoleBodyType>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { description } = req.body;

      const role = await prisma.roles.update({
        where: { id: Number(id) },
        data: { description },
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Rol actualizado',
        body: {
          role,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Roles - UPDATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);
