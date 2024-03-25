import { Product } from '../../modules/product/product.model';
import { User } from '../../modules/user/user.model';

import superagent from 'superagent';

declare global {
  namespace supertest {
    interface Test extends superagent.SuperAgentRequest {
      user?: User;
      product?: Product;
      author: User;
    }
  }
}
