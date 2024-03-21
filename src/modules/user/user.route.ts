import { Router } from 'express';
import UserController, { loadUser } from './user.controller';
import { verifyAuth } from '../auth/auth.middleware';

const userRouter = Router();
const userController = new UserController();

userRouter.get('/users', verifyAuth, userController.getUser);
userRouter.get('/users/:userId', userController.getUserById);
userRouter.post('/users', userController.createUser);
userRouter.delete('/users/:userId', userController.deleteUser);
userRouter.put('/users/:userId', verifyAuth, userController.updateUser);

userRouter.param('userId', loadUser);

export default userRouter;
