import { Router } from 'express';
import OrderController from './order.controller';

const orderRouter = Router();
const orderController = new OrderController();

orderRouter.get('/orders', orderController.getOrder);
orderRouter.get('/orders/:orderId', orderController.getOrderById);
orderRouter.post('/orders', orderController.createOrder);
orderRouter.delete('/orders/:orderId', orderController.deleteOrder);
orderRouter.put('/orders/:orderId', orderController.updateOrder);

export default orderRouter;
