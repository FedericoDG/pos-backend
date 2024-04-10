import { NextFunction, Response, Request } from 'express';
import createHttpError from 'http-errors';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';

import { CreateSupplierType, UpdateSupplierType } from '../schemas/supplier.schema';
import prisma from '../helpers/prisma';

export const getAll = asyncHandler(
  async (_req: Request<unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const suppliers = await prisma.suppliers.findMany({
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
        message: 'Proveedores recuperados',
        body: {
          suppliers,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Suppliers - GET ALL]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const getById = asyncHandler(
  async (req: Request<{ id?: number }, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const supplier = await prisma.suppliers.findFirst({
        where: { id: Number(id) },
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Proveedor recuperado',
        body: {
          supplier,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Suppliers - GET ONE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const create = asyncHandler(
  async (req: Request<unknown, unknown, CreateSupplierType>, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      const supplier = await prisma.suppliers.create({ data });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Proveedor creado',
        body: {
          supplier,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Suppliers - CREATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const update = asyncHandler(
  async (req: Request<{ id?: number }, unknown, UpdateSupplierType>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, email, phone, mobile, address, info, stateId, city } = req.body;

      const supplier = await prisma.suppliers.update({
        where: { id: Number(id) },
        data: { name, email, phone, mobile, address, info, stateId, city },
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Proveedor actualizado',
        body: {
          supplier,
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

      const supplier = await prisma.suppliers.delete({
        where: { id: Number(id) },
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Proveedor eliminado',
        body: {
          supplier,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Suppliers - DELETE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);
