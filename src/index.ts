import { createServer } from './config/express';
import { Server } from 'socket.io';
import { logger } from './config/logger';
import * as moduleAlias from 'module-alias';
import http from 'http';

const sourcePath = process.env.NODE_ENV === 'development' ? 'src' : __dirname;

moduleAlias.addAliases({
  '@server': sourcePath,
  '@config': `${sourcePath}/config`,
  '@domain': `${sourcePath}/domain`,
});

const port = process.env.PORT;

async function startServer() {
  const app = createServer();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected: ', socket.id);

    socket.on('join_channel', (data) => {
      socket.join(data);
    });

    socket.on('send_transaction', (data) => {
      socket.to(data.channel).emit('income_transaction', data.message);
    });
  });

  server.listen(port, () => {
    logger.info(`Server ready on port: ${port}`);
  });

  const signalTraps: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
  signalTraps.forEach((type) => {
    process.once(type, async () => {
      logger.info(`process.once ${type}`);

      server.close(() => {
        logger.debug('HTTP server closed');
      });
    });
  });
}

startServer();
