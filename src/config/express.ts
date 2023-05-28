import express, { Request, Response } from 'express';
import createError from 'http-errors';
import cors from 'cors';

import router from '../routes/index.route';

const createServer = (): express.Application => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use('/', router);

  app.use((_req, _res, next) => {
    next(createError(404));
  });

  // error handler
  app.use((err: any, req: Request, res: Response) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
  });

  app.disable('x-powered-by');

  return app;
};

export { createServer };
