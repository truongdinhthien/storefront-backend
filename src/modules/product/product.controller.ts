import { Response, Request } from 'express';
import { success } from '../../common/utils/response';

class ProductController {
  getProduct(req: Request, res: Response) {
    return res.json(success({}));
  }

  getProductById(req: Request, res: Response) {
    return res.json(success({}));
  }

  createProduct(req: Request, res: Response) {
    return res.json(success({}));
  }

  deleteProduct(req: Request, res: Response) {
    return res.json(success({}));
  }

  updateProduct(req: Request, res: Response) {
    return res.json(success({}));
  }
}

export default ProductController;
