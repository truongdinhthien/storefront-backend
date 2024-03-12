import { User } from '../../modules/user/user.model';

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: User;
      author: User;
    }
  }
}
