import * as tslib from 'tslib';
import { AddressInfo } from 'net';
import { Server } from 'socket.io';
import * as dotenv from 'dotenv';
import http from 'http';

import { createServer } from './config/express';
import { logger } from './config/logger';

dotenv.config();

const host = process.env.HOST;
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
  });

  server.listen({ host, port }, () => {
    const addressInfo = server.address() as AddressInfo;

    logger.info(`Server ready at http://${addressInfo.address}:${addressInfo.port}`);
  });
}

startServer();
