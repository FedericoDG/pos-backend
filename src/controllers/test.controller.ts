import { Response, Request } from 'express';
import { asyncHandler } from '../helpers/asyncHandler';
import { endpointResponse } from '../helpers/endpointResponse';

export const test = asyncHandler(async (_req: Request<unknown, unknown, unknown>, res: Response) => {
  endpointResponse({
    res,
    code: 200,
    status: true,
    message: 'Test endpoint',
    body: {
      message: 'OK!',
    },
  });
});
