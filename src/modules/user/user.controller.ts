import { Response, Request, NextFunction } from 'express';
import { success } from '../../common/utils/response';
import UserModel from './user.model';
import { HttpNotFoundException } from '../../common/exceptions';

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
      return res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  }

  getUserById(req: Request, res: Response) {
    return res.status(200).json(success(req.user));
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userModel.create(req.body);
      return res.json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userModel.delete(Number(req.params.userId));
      return res.json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userModel.update(
        Number(req.params.userId),
        req.body,
      );
      return res.json(success(result));
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
