import { NextFunction, Request, Response } from 'express';

interface CustomeReq extends Request {
  payload: number;
}
export type ExpressFunction = (
  req: CustomeReq,
  res: Response,
  next: NextFunction
) => void;

export type ExpressFunctionAsync = (
  req: CustomeReq,
  res: Response,
  next: NextFunction
) => Promise<void>;
