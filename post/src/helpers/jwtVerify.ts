import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import createHttpError from 'http-errors';

interface CustomRequest extends Request {
  payload?: number;
}
const verifyToken: RequestHandler = (req: CustomRequest, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  const secret = process.env.ACCESS_TOKEN_SECRET;

  if (!token) return next(createHttpError.Unauthorized('No token provided'));
  if (!secret)
    return next(createHttpError.BadGateway('Server configuration error'));

  jwt.verify(token, secret, (err, payload) => {
    if (err) {
      const message =
        err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
      return next(createHttpError.Unauthorized(message));
    }

    const aud = (payload as JwtPayload).aud;
    if (typeof aud === 'string') {
      const audNumber = Number(aud);
      if (!isNaN(audNumber)) {
        req.payload = audNumber;
      } else {
        return next(createHttpError.Unauthorized('Invalid audience value'));
      }
    } else {
      return next(createHttpError.Unauthorized('Invalid audience value'));
    }

    next();
  });
};

export default verifyToken;
