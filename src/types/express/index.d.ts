import { Product } from '../../modules/product/product.model';
import { User } from '../../modules/user/user.model';

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: User;
      product?: Product;
      author: User;
    }
  }
}
