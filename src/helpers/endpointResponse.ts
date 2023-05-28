import { Response } from 'express';

interface EndpointResponse {
  res: Response;
  code: number;
  status: boolean;
  message: string;
  body: Record<string, unknown>;
}

export const endpointResponse = ({ res, code = 200, status = true, message, body }: EndpointResponse) => {
  res.status(code).json({
    status,
    code,
    message,
    body,
  });
};
