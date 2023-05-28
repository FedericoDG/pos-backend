import { NextFunction, Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';

import { CreateUnitType, UpdateUnitType } from '../schemas/unit.schema';

const prisma = new PrismaClient();

export const getAll = asyncHandler(
  async (_req: Request<unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const units = await prisma.units.findMany();

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Unidades recuperados',
        body: {
          units,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Units - GET ALL]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const getById = asyncHandler(
  async (req: Request<{ id?: number }, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const unit = await prisma.units.findFirst({ where: { id: Number(id) } });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Unidad recuperada',
        body: {
          unit,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Units - GET ONE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const create = asyncHandler(
  async (req: Request<unknown, unknown, CreateUnitType>, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const unit = await prisma.units.create({ data });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Unidad creada',
        body: {
          unit,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Units - CREATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const update = asyncHandler(
  async (req: Request<{ id?: number }, unknown, UpdateUnitType>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const unit = await prisma.units.update({
        where: { id: Number(id) },
        data: { name },
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Unidad actualizada',
        body: {
          unit,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Units - UPDATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const remove = asyncHandler(
  async (req: Request<{ id?: number }, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const unit = await prisma.units.delete({
        where: { id: Number(id) },
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Unidad eliminada',
        body: {
          unit,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Units - DELETE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);
