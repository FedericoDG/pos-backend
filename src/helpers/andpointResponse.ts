import { Response } from 'express';

interface Props {
  res: Response;
  code: number;
  status: boolean;
  message: string;
  body: Record<any, any>;
  options?: any;
}

const endpointResponse = ({ res, code = 200, status = true, message, body, options }: Props) => {
  res.status(code).json({
    status,
    code,
    message,
    body,
    options,
  });
};

export default endpointResponse;
