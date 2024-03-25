import { Response, Request, NextFunction } from 'express';
import { success } from '../../common/utils/response';
import OrderModel from './order.model';
import httpStatus from 'http-status';
import { HttpForbiddenException } from '../../common/exceptions';

const orderModel = new OrderModel();

class OrderController {
  async getOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await orderModel.getAll(req.query);
      return res.status(httpStatus.OK).json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await orderModel.create({
        ...req.body,
        userId: req.author.id,
      });
      return res.status(httpStatus.OK).json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = Number(req.params.orderId);
      const order = await orderModel.getById(orderId);
      const authorId = req.author.id;
      if (authorId !== order?.user.id) {
        return next(new HttpForbiddenException('No permission'));
      }
      const result = await orderModel.updateStatus(
        Number(req.params.orderId),
        req.body,
      );
      return res.status(httpStatus.OK).json(success(result));
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
