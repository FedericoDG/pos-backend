import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import { jwtVerify } from '../helpers/jwt';

import { UserType } from '../types';

export const validToken = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      code: 401,
      status: false,
      message: 'Necesitas enviar un token',
    });
  }

  if (!authorization.split(' ')[1]) {
    return res.status(401).json({
      code: 401,
      status: false,
      message: 'Necesitas enviar un token',
    });
  }

  const token = authorization.split('Bearer ')[1];

  try {
    const decoded = jwtVerify(token);

    const user = decoded as JwtPayload;

    req.user = user;

    return next();
  } catch {
    res.status(403).json({
      code: 403,
      status: false,
      message: 'Token inválido',
    });
  }
};

export const accessLevel = (level: UserType) => (req: Request, res: Response, next: NextFunction) => {
  const userType = req.user.role.id;

  let accLvl: number;

  switch (level) {
    case 'SUPERADMIN':
      accLvl = 1;
      break;
    case 'ADMIN':
      accLvl = 2;
      break;
    case 'VENDOR':
      accLvl = 3;
      break;
    case 'USER':
      accLvl = 4;
      break;
    default:
      accLvl = 5;
      break;
  }

  if (userType > accLvl) {
    return res.status(401).json({
      code: 401,
      status: false,
      message: 'Permisos insuficientes',
    });
  }

  return next();
};
