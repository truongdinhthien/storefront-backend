import { NextFunction, Request, Response } from 'express';
import { ApiException, HttpNotFoundException } from '../exceptions';
import { error } from '../utils/response';

export const errorMiddleware = (
  err: ApiException,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  return res.status(err.status || 500).json(error(err.message));
};

export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  next(new HttpNotFoundException('API not found'));
};
