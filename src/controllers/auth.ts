import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

import endpointResponse from '../helpers/andpointResponse';
import asyncHandler from '../helpers/asyncHandler';

export const login = asyncHandler(async (_req: Request, res: Response, next: NextFunction) => {
  try {
    // const { user } = req;
    // const { password, balance, createdAt, updatedAt, ...rest } = user;
    // const token = jwt.sign(user);

    endpointResponse({
      res,
      code: 200,
      status: true,
      message: 'asdasdasd',
      body: {
        user: 'fede',
      },
    });
  } catch (error: any) {
    const httpError = createHttpError(error.statusCode, `[Error creating user] - [index - GET]: ${error.message}`);
    next(httpError);
  }
});
