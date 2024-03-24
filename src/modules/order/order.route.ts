import { Router } from 'express';
import OrderController from './order.controller';
import { verifyAuth } from '../auth/auth.middleware';

const orderRouter = Router();
const orderController = new OrderController();

orderRouter.get('/orders', verifyAuth, orderController.getOrder);
orderRouter.post('/orders', verifyAuth, orderController.createOrder);
orderRouter.put(
  '/orders/:orderId/status',
  verifyAuth,
  orderController.updateOrderStatus,
);

export default orderRouter;
