import CONFIG from '../../common/config';
import { HttpNotFoundException } from '../../common/exceptions';
import db from '../../database';
import bcrypt from 'bcrypt';

export interface UserTable {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  hashed_password: string;
}

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

export interface UserCredentials {
  email: string;
  password: string;
}

export const transformUser = (userTable: UserTable): User => {
  return {
    id: Number(userTable.id),
    email: userTable.email,
    firstName: userTable.first_name,
    lastName: userTable.last_name,
    hashedPassword: userTable.hashed_password,
  };
};

class UserModel {
  async getAll(): Promise<User[]> {
    const result = await db.executeQuery<UserTable>('SELECT * FROM users');
    return result.map(transformUser);
  }

  async getById(id: number): Promise<User | null> {
    const result = await db.executeQuery<UserTable>(
      'SELECT * FROM users WHERE id = $1',
      [id],
    );
    if (!result.length) return null;
    return transformUser(result[0]);
  }

  async getByCredentials(data: UserCredentials): Promise<User | null> {
    const { email, password } = data;
    const result = await db.executeQuery<UserTable>(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );
    if (!result.length) return null;

    const user = transformUser(result[0]);
    const matchPassword = await this.comparePassword(
      password,
      user.hashedPassword,
    );
    if (!matchPassword) return null;

    return user;
  }

  async create(data: CreateUserInput): Promise<User> {
    const { email, firstName, lastName, password } = data;
    const hashedPassword = await this.hashPassword(password);

    const result = await db.executeQuery<UserTable>(
      'INSERT INTO users (email, first_name, last_name, hashed_password) VALUES($1, $2, $3, $4) RETURNING *',
      [email, firstName, lastName, hashedPassword],
    );

    return transformUser(result[0]);
  }

  async delete(id: number): Promise<boolean> {
    await db.executeQuery('DELETE FROM users WHERE id=($1)', [id]);
    return true;
  }

  async update(id: number, data: UpdateUserInput): Promise<User> {
    const { firstName, lastName } = data;
    const result = await db.executeQuery<UserTable>(
      'UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3 RETURNING *',
      [firstName, lastName, id],
    );
    return transformUser(result[0]);
  }

  private async hashPassword(password: string): Promise<string> {
    const passwordWithSuffix = password + CONFIG.PASSWORD_HASH_SUFFIX;
    return await bcrypt.hash(
      passwordWithSuffix,
      CONFIG.PASSWORD_HASH_SALT_ROUNDS,
    );
  }

  private async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const passwordWithSuffix = password + CONFIG.PASSWORD_HASH_SUFFIX;
    return await bcrypt.compare(passwordWithSuffix, hashedPassword);
  }
}

export default UserModel;
