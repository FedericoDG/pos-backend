import { Client, User } from '../';

declare global {
  namespace Express {
    interface Request {
      user: User;
      client: Client;
    }
  }
}

declare module 'jsonwebtoken' {
  export interface JwtPayload extends User {
    iat: number;
  }
}
