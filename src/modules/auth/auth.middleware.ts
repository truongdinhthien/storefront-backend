import { NextFunction, Request, Response } from 'express';
import { HttpUnauthorizedException } from '../../common/exceptions';
import { decodeToken } from '../../common/utils/jwt';
import UserModel from '../user/user.model';

const userModel = new UserModel();

export const verifyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token = req.headers.authorization;
  if (!token) return next(new HttpUnauthorizedException('Invalid token'));

  token = token.split(' ')[1];
  const payload = decodeToken(token);
  if (!payload) return next(new HttpUnauthorizedException('Invalid token'));

  const author = await userModel.getById(payload.authorId);
  if (!author) return next(new HttpUnauthorizedException('Author not found'));
  req.author = author;
  next();
};
