import { Response, Request } from 'express';
import { asyncHandler } from 'src/helpers/asyncHandler';
import { endpointResponse } from 'src/helpers/endpointResponse';

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
