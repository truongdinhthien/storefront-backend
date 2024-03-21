import { Response, Request, NextFunction } from 'express';
import { success } from '../../common/utils/response';
import UserModel from '../user/user.model';
import httpStatus from 'http-status';
import { signToken } from '../../common/utils/jwt';
import { HttpBadRequestException } from '../../common/exceptions';

const userModel = new UserModel();

class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userModel.getByCredentials(req.body);
      if (!user) {
        return next(new HttpBadRequestException('Invalid email or password'));
      }
      const accessToken = signToken({
        authorId: user.id,
      });
      return res.status(httpStatus.OK).json(success({ accessToken }));
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
