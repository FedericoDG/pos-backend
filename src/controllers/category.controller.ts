import { NextFunction, Response, Request } from 'express';
import createHttpError from 'http-errors';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';

import { CreateCategoryType, UpdateCategoryType } from '../schemas/category.schema';
import prisma from '../helpers/prisma';

export const getAll = asyncHandler(
  async (_req: Request<unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const categories = await prisma.categories.findMany({ include: { products: { include: { unit: true } } } });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Categorías recuperadas',
        body: {
          categories,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Categories - GET ALL]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const getById = asyncHandler(
  async (req: Request<{ id?: number }, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const category = await prisma.categories.findFirst({
        where: { id: Number(id) },
        include: {
          products: {
            include: { unit: true },
          },
        },
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Categoría recuperada',
        body: {
          category,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Category - GET ONE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const create = asyncHandler(
  async (req: Request<unknown, unknown, CreateCategoryType>, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      const category = await prisma.categories.create({ data });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Categoría creada',
        body: {
          category,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Category - CREATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const update = asyncHandler(
  async (req: Request<{ id?: number }, unknown, UpdateCategoryType>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const category = await prisma.categories.update({
        where: { id: Number(id) },
        data: { name, description },
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Categoría actualizada',
        body: {
          category,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Category - UPDATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const remove = asyncHandler(
  async (req: Request<{ id?: number }, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const category = await prisma.categories.delete({
        where: { id: Number(id) },
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Categoría eliminada',
        body: {
          category,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Category - DELETE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);
