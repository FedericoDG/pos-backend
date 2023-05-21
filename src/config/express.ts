import router from '../routes';
import express, { Request, Response } from 'express';
import createError from 'http-errors';

const createServer = (): express.Application => {
  const app = express();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use('/', router);

  // catch 404 and forward to error handler
  app.use((_req, _res, next) => {
    next(createError(404));
  });

  // error handler
  app.use((err: any, req: Request, res: Response) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  app.disable('x-powered-by');

  app.get('/health', (_req, res) => {
    res.send('UP');
  });

  return app;
};

export { createServer };
