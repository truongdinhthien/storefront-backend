import { Router } from 'express';
import UserController from './user.controller';

const userRouter = Router();
const userController = new UserController();

userRouter.get('/users', userController.getUser);
userRouter.get('/users/:userId', userController.getUserById);
userRouter.post('/users', userController.createUser);
userRouter.delete('/users/:userId', userController.deleteUser);
userRouter.put('/users/:userId', userController.updateUser);

export default userRouter;
