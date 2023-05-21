import jsonWebToken from 'jsonwebtoken';

export const JwtSign = (object: any) => jsonWebToken.sign(object, process.env.SECRET);

export const JwtDecode = (token: string) => jsonWebToken.decode(token);

export const JwtVerify = (token: string) =>
  jsonWebToken.verify(token, process.env.SECRET, (error) => {
    if (error) return false;

    return true;
  });
