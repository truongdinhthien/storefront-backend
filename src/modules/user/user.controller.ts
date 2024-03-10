import { Response, Request } from 'express';
import { success } from '../../common/utils/response';

class UserController {
  getUser(req: Request, res: Response) {
    return res.json(success({}));
  }

  getUserById(req: Request, res: Response) {
    return res.json(success({}));
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
