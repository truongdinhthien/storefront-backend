import express, { Router } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import CONFIG from './common/config';
import userRouter from './modules/user/user.route';
import orderRouter from './modules/order/order.route';
import productRouter from './modules/product/product.route';
import {
  errorMiddleware,
  notFoundMiddleware,
} from './common/middlewares/error.middleware';
import authRouter from './modules/auth/auth.route';

const app: express.Application = express();

// Common Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('tiny'));

// App router
const appRouter = Router();
appRouter.use(authRouter);
appRouter.use(userRouter);
appRouter.use(orderRouter);
appRouter.use(productRouter);

app.use('/api', appRouter);

//Error middleware
app.use(notFoundMiddleware);
app.use(errorMiddleware);

// App listen
const address: string = `0.0.0.0:${CONFIG.PORT}`;
app.listen(CONFIG.PORT, function () {
  console.log(`Starting app on: ${address}`);
});
