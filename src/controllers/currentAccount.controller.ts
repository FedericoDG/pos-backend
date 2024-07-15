import { NextFunction, Response, Request } from 'express';
import createHttpError from 'http-errors';

import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';

import prisma from '../helpers/prisma';
import { CreatePaymentType } from 'src/schemas/currentAccount.schema';

export const getAll = asyncHandler(
  async (_req: Request<unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const clients = await prisma.clients.findMany({
        include: { identification: true, ivaType: true, state: true },
        orderBy: [
          {
            updatedAt: 'desc',
          },
        ],
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Clientes recuperados',
        body: {
          clients,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Clients - GET ALL]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const getById = asyncHandler(
  async (req: Request<{ id?: number }, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const currentAccount = await prisma.currentAccount.findFirst({
        where: { clientId: Number(id) },
        include: { client: true },
      });

      const currentAccountDetails = await prisma.currentAccountDetails.findMany({
        where: { currentAccountId: currentAccount?.id },
        include: { paymentMethod: true },
      });

      const charges = currentAccountDetails
        .filter((item) => item.type === 'CHARGE')
        .reduce((total, item) => total + item.amount, 0);

      const payments = currentAccountDetails
        .filter((item) => item.type === 'PAYMENT')
        .reduce((total, item) => total + item.amount, 0);

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Cuenta Corriente recuperada',
        body: {
          currentAccount,
          currentAccountDetails,
          charges,
          payments,
          total: payments - charges,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Current Account - GET ONE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);

export const createPaymnet = asyncHandler(
  async (req: Request<unknown, unknown, CreatePaymentType>, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      const payment = await prisma.currentAccountDetails.create({ data });

      await prisma.currentAccount.update({
        where: { id: data.currentAccountId },
        data: {
          balance: {
            decrement: data.amount,
          },
        },
      });

      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'Pago Creado',
        body: {
          payment,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const httpError = createHttpError(500, `[Current Account - CREATE]: ${error.message}`);
        next(httpError);
      }
    }
  },
);
