import jsonWebToken from 'jsonwebtoken';

import { User } from '../types';

export const jwtSign = (user: User) => jsonWebToken.sign(user, process.env.SECRET || '');

export const jwtDecode = (token: string) => jsonWebToken.decode(token);

export const jwtVerify = (token: string) => jsonWebToken.verify(token, process.env.SECRET || '');
