import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Props {
  model: string;
  column: string;
}

export const valueIsAlreadyInUse =
  ({ model, column }: Props) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const value = req.body[`${column}`];

    const where = {
      [column]: value,
    };

    const row = await prisma[`${model}`].findFirst({ where });

    if (row) {
      return res.status(403).json({
        code: 403,
        status: false,
        message: `El ${column} ya se encuentra en uso`,
      });
    }

    return next();
  };
