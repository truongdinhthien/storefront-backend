import { Response, Request, NextFunction } from 'express';
import { success } from '../../common/utils/response';
import UserModel, { User } from './user.model';

const userModel = new UserModel();

export const loadUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
  userId: string,
) => {
  const id = parseInt(userId);
  const user = await userModel.getById(id);
  req.user = user;

  return next();
};

class UserController {
  async getUser(req: Request, res: Response) {
    const users = await userModel.getAll();
    return res.status(200).json(success(users));
  }

  getUserById(req: Request, res: Response) {
    return res.status(200).json(success(req.user));
  }

  createUser(req: Request, res: Response) {
    return res.json(success({}));
  }

  deleteUser(req: Request, res: Response) {
    return res.json(success({}));
  }

  updateUser(req: Request, res: Response) {
    return res.json(success({}));
  }
}

export default UserController;
