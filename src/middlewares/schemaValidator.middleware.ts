import { AnyZodObject, ZodError } from 'zod';
import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

export const schemaValidator = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(
        error.issues.map((isue) => ({
          path: isue.path,
          message: isue.message,
        })),
      );
    }
    if (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Middleware]: ${error.message}`);
        next(httpError);
      }
    }
  }
};
