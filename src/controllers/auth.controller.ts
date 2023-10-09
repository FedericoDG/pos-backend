import { NextFunction, Response, Request } from 'express';
import createHttpError from 'http-errors';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';
import { jwtSign } from '../helpers/jwt';

import { LoginType } from '../schemas/auth.schema';

export const login = asyncHandler(
  async (req: Request<unknown, unknown, LoginType>, res: Response, next: NextFunction) => {
    try {
      const { user } = req;
      const token = jwtSign(user);

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Login exitoso',
        body: {
          user,
          token,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Auth - LOGIN]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const loginClient = asyncHandler(
  async (req: Request<unknown, unknown, LoginType>, res: Response, next: NextFunction) => {
    try {
      const { client } = req;
      const token = jwtSign(client);

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Login exitoso',
        body: {
          client,
          token,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Auth - LOGIN CLIENT]: ${error.message}`);
        next(httpError);
      }
    }
  },
);
