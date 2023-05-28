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

    const fede = {
      [column]: value,
    };

    const row = await prisma[`${model}`].findFirst({ where: fede });

    if (row) {
      return res.status(403).json({
        code: 200,
        status: true,
        message: `El ${column} ya se encuentra en uso`,
      });
    }

    return next();
  };
