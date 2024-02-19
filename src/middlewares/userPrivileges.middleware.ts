import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';

import { bcCompare } from '../helpers/bcrypt';

import { Client } from '../types';

const prisma = new PrismaClient();

export const userExist = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.users.findFirst({
      where: { email },
      include: {
        role: true,
        userPreferences: true,
      },
    });

    if (!user) {
      return res.status(403).json({
        code: 403,
        status: false,
        message: 'Usuario y/o contraseña incorrecta',
      });
    }

    const match = await bcCompare(password, user.password);

    if (!match) {
      return res.status(403).json({
        code: 403,
        status: false,
        message: 'Usuario y/o contraseña incorrecta',
      });
    }

    req.user = user;

    return next();
  } catch (error) {
    if (error instanceof Error) {
      const httpError = createHttpError(500, `[Middleware]: ${error.message}`);
      next(httpError);
    }
  }
};

export const clientExist = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const client = await prisma.clients.findFirst({
      where: { email },
      include: {
        role: true,
      },
    });

    if (!client) {
      return res.status(403).json({
        code: 403,
        status: false,
        message: 'Usuario y/o contraseña incorrecta',
      });
    }

    const match = await bcCompare(password, client.password);

    if (!match) {
      return res.status(403).json({
        code: 403,
        status: false,
        message: 'Usuario y/o contraseña incorrecta',
      });
    }

    req.client = client as Client;

    return next();
  } catch (error) {
    if (error instanceof Error) {
      const httpError = createHttpError(500, `[Middleware]: ${error.message}`);
      next(httpError);
    }
  }
};

export const driverExist = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.users.findFirst({
      where: { email },
      include: {
        role: true,
        userPreferences: true,
      },
    });

    if (!user) {
      return res.status(403).json({
        code: 403,
        status: false,
        message: 'Usuario y/o contraseña incorrecta',
      });
    }

    if (user.role.name !== 'DRIVER') {
      return res.status(403).json({
        code: 403,
        status: false,
        message: 'Usuario y/o contraseña incorrecta',
      });
    }

    const match = await bcCompare(password, user.password);

    if (!match) {
      return res.status(403).json({
        code: 403,
        status: false,
        message: 'Usuario y/o contraseña incorrecta',
      });
    }

    req.user = user;

    return next();
  } catch (error) {
    if (error instanceof Error) {
      const httpError = createHttpError(500, `[Middleware]: ${error.message}`);
      next(httpError);
    }
  }
};
