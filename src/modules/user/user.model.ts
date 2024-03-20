import CONFIG from '../../common/config';
import db from '../../database';
import bcrypt from 'bcrypt';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  hashedPassword: string;
}

export interface CreateUserInput extends Omit<User, 'id' | 'hashedPassword'> {
  password: string;
}

export interface UpdateUserInput
  extends Omit<User, 'id' | 'hashedPassword' | 'email'> {}

class UserModel {
  async getAll(): Promise<User[]> {
    return await db.executeQuery<User>('SELECT * FROM users');
  }

  async getById(id: number): Promise<User> {
    const users = await db.executeQuery<User>(
      'SELECT * FROM users WHERE id = $1',
      [id],
    );
    return users[0];
  }

  async create(data: CreateUserInput): Promise<User> {
    const { email, firstName, lastName, password } = data;
    const hashedPassword = await this.hashPassword(password);

    const result = await db.executeQuery<User>(
      'INSERT INTO users (email, firstName, lastName, hashedPassword) VALUES($1, $2, $3, $4) RETURNING *',
      [email, firstName, lastName, hashedPassword],
    );

    return result[0];
  }

  async delete(id: number): Promise<boolean> {
    await db.executeQuery('DELETE FROM users WHERE id=($1)', [id]);
    return true;
  }

  async update(id: number, data: UpdateUserInput): Promise<User> {
    const { firstName, lastName } = data;
    const result = await db.executeQuery<User>(
      'UPDATE users SET firstName = $1, lastName = $2 WHERE id = $3 RETURNING *',
      [firstName, lastName, id],
    );
    return result[0];
  }

  private async hashPassword(password: string) {
    const passwordWithSuffix = password + CONFIG.PASSWORD_HASH_SUFFIX;
    return await bcrypt.hash(
      passwordWithSuffix,
      CONFIG.PASSWORD_HASH_SALT_ROUNDS,
    );
  }
}

export default UserModel;
