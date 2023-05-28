import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const isEmailAlreadyInUse = (model: string) => async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  const row = await prisma[`${model}`].findFirst({ where: { email } });

  if (row) {
    return res.status(403).json({
      code: 200,
      status: true,
      message: 'El email ya se encuentra en uso',
    });
  }

  return next();
};
