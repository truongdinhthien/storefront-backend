import db from '../../database';
import { IModel } from '../../database/model-interface';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  hashedPassword: string;
}

class UserModel implements IModel<User> {
  async getAll(): Promise<User[]> {
    return await db.executeQuery<User>('SELECT * FROM users');
  }
  async getById(id: number): Promise<User> {
    return (
      await db.executeQuery<User>('SELECT * FROM users where id = $1', [id])
    )[0];
  }
  async create(data: Partial<User>): Promise<User> {
    throw new Error('Method not implemented.');
  }
  async delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  async update(id: number): Promise<User> {
    throw new Error('Method not implemented.');
  }
}

export default UserModel;
