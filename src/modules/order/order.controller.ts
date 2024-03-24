import { Response, Request, NextFunction } from 'express';
import { success } from '../../common/utils/response';
import OrderModel from './order.model';
import httpStatus from 'http-status';

const orderModel = new OrderModel();

class OrderController {
  async getOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await orderModel.getAll();
      return res.status(httpStatus.OK).json(success(result));
    } catch (error) {
      next(error);
    }
  }

  getOrderById(req: Request, res: Response) {
    return res.json(success({}));
  }

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await orderModel.create(req.body);
      return res.status(httpStatus.CREATED).json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await orderModel.updateStatus(
        Number(req.params.orderId),
        req.body,
      );
      return res.status(httpStatus.CREATED).json(success(result));
    } catch (error) {
      next(error);
    }
  }

  // deleteOrder(req: Request, res: Response) {
  //   return res.json(success({}));
  // }

  // updateOrder(req: Request, res: Response) {
  //   return res.json(success({}));
  // }
}

export default OrderController;
