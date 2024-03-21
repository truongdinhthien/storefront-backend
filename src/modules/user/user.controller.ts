import { Response, Request, NextFunction } from 'express';
import { success } from '../../common/utils/response';
import UserModel from './user.model';
import {
  HttpForbiddenException,
  HttpNotFoundException,
} from '../../common/exceptions';
import httpStatus from 'http-status';

const userModel = new UserModel();

export const loadUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
  userId: string,
) => {
  const id = Number(userId);
  const user = await userModel.getById(id);
  if (!user) return next(new HttpNotFoundException('User not found'));
  req.user = user;

  return next();
};

class UserController {
  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userModel.getAll();
      return res.status(httpStatus.OK).json(success(result));
    } catch (error) {
      next(error);
    }
  }

  getUserById(req: Request, res: Response) {
    return res.status(httpStatus.OK).json(success(req.user));
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userModel.create(req.body);
      return res.status(httpStatus.CREATED).json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userModel.delete(Number(req.params.userId));
      return res.status(httpStatus.OK).json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.params.userId);
      const authorId = req.author.id;
      if (authorId !== userId) {
        return next(new HttpForbiddenException('No permission'));
      }
      const result = await userModel.update(userId, req.body);
      return res.status(httpStatus.OK).json(success(result));
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
