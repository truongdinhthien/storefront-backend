import { Response, Request } from 'express';
import { success } from '../../common/utils/response';

class OrderController {
  getOrder(req: Request, res: Response) {
    return res.json(success({}));
  }

  getOrderById(req: Request, res: Response) {
    return res.json(success({}));
  }

  createOrder(req: Request, res: Response) {
    return res.json(success({}));
  }

  deleteOrder(req: Request, res: Response) {
    return res.json(success({}));
  }

  updateOrder(req: Request, res: Response) {
    return res.json(success({}));
  }
}

export default OrderController;
