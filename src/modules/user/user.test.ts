import supertest from 'supertest';
import app from '../../server';
import UserModel, { User } from './user.model';
import { signToken } from '../../common/utils/jwt';

const request = supertest(app);
const userModel = new UserModel();

describe('User model', () => {
  let dummyUsers: User[] | null = null;
  beforeAll(async () => {
    const users = [
      {
        email: 'test1@gmail.com',
        firstName: 'Test',
        lastName: 'User1',
        password: 'password1',
      },
      {
        email: 'test2@gmail.com',
        firstName: 'Test',
        lastName: 'User2',
        password: 'password2',
      },
    ];
    dummyUsers = await Promise.all(users.map(userModel.create.bind(userModel)));
  });

  it('getAll method should return list of users', async () => {
    const actualUsers = await userModel.getAll();
    actualUsers.forEach((user) => {
      const foundUser = dummyUsers?.find(({ id }) => user.id === id);
      expect(foundUser).toBeDefined();
      if (foundUser) {
        expect(foundUser.email).toEqual(user.email);
        expect(foundUser.firstName).toEqual(user.firstName);
        expect(foundUser.lastName).toEqual(user.lastName);
        expect(foundUser.hashedPassword).toEqual(user.hashedPassword);
      }
    });
  });

  it('getById method should return user with valid id', async () => {
    const expectedUser = dummyUsers![0];
    const actualUsers = await userModel.getById(expectedUser.id);

    expect(actualUsers).not.toBeNull();
    if (actualUsers) {
      expect(actualUsers.email).toEqual(expectedUser.email);
      expect(actualUsers.firstName).toEqual(expectedUser.firstName);
      expect(actualUsers.lastName).toEqual(expectedUser.lastName);
      expect(actualUsers.hashedPassword).toEqual(expectedUser.hashedPassword);
    }
  });

  it('getById method should return null with invalid id', async () => {
    const actualUsers = await userModel.getById(99999);
    expect(actualUsers).toBeNull();
  });

  it('getByCredentials method should return user with valid email and password', async () => {
    const expectedUser = dummyUsers![0];
    const actualUsers = await userModel.getByCredentials({
      email: expectedUser.email,
      password: 'password1', // Look at user in hook beforeAll to get raw password
    });

    expect(actualUsers).not.toBeNull();
    if (actualUsers) {
      expect(actualUsers.email).toEqual(expectedUser.email);
      expect(actualUsers.firstName).toEqual(expectedUser.firstName);
      expect(actualUsers.lastName).toEqual(expectedUser.lastName);
      expect(actualUsers.hashedPassword).toEqual(expectedUser.hashedPassword);
    }
  });

  it('getByCredentials method should return null with invalid email', async () => {
    const actualUsers = await userModel.getByCredentials({
      email: 'wrong@gmail.com',
      password: 'password1', // Look at user in hook beforeAll to get raw password
    });
    expect(actualUsers).toBeNull();
  });

  it('getByCredentials method should return null with invalid password', async () => {
    const expectedUser = dummyUsers![0];
    const actualUsers = await userModel.getByCredentials({
      email: expectedUser.email,
      password: 'pAsSwOrD1',
    });
    expect(actualUsers).toBeNull();
  });

  it('create method should return new user', async () => {
    const expectedUser = {
      email: 'new@gmail.com',
      firstName: 'Test',
      lastName: 'New',
      password: 'new_password',
    };
    const actualUsers = await userModel.create(expectedUser);

    expect(actualUsers.email).toEqual(expectedUser.email);
    expect(actualUsers.firstName).toEqual(expectedUser.firstName);
    expect(actualUsers.lastName).toEqual(expectedUser.lastName);

    await userModel.delete(actualUsers.id);
  });

  it('create method should throw error with duplicate email', async () => {
    const expectedUser = {
      email: dummyUsers![0].email, // Duplicate email with dummy users
      firstName: 'Test',
      lastName: 'New',
      password: 'new_password',
    };
    await expectAsync(userModel.create(expectedUser)).toBeRejected();
  });

  it('delete method should delete exist user', async () => {
    const user = {
      email: 'new@gmail.com',
      firstName: 'Test',
      lastName: 'New',
      password: 'new_password',
    };
    const actualUsers = await userModel.create(user);
    await userModel.delete(actualUsers.id);

    await expectAsync(userModel.getById(actualUsers.id)).toBeResolvedTo(null);
  });

  it('update method should update user', async () => {
    const actualUsers = await userModel.create({
      email: 'new@gmail.com',
      firstName: 'Test',
      lastName: 'New',
      password: 'new_password',
    });

    const expectedUser = await userModel.update(actualUsers.id, {
      ...actualUsers,
      firstName: 'Updated',
    });

    actualUsers.firstName = 'Updated';

    expect(actualUsers.email).toEqual(expectedUser.email);
    expect(actualUsers.firstName).toEqual(expectedUser.firstName);
    expect(actualUsers.lastName).toEqual(expectedUser.lastName);

    await userModel.delete(actualUsers.id);
  });

  afterAll(async () => {
    await Promise.allSettled(
      (dummyUsers || []).map(({ id }) => userModel.delete(id)),
    );
  });
});

describe('User endpoints', () => {
  const expectedUser = {
    id: 0,
    email: 'test1@gmail.com',
    firstName: 'Test',
    lastName: 'User1',
    password: 'password1',
  };
  let token: string;
  describe('POST /api/users', () => {
    it('should return 200', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...sendUser } = expectedUser;
      const response = await request.post('/api/users').send(sendUser);

      expect(response.status).toBe(200);
      const actualUser = response.body.data;
      token = signToken({ authorId: actualUser.id });
      expectedUser.id = actualUser.id;
    });
  });

  describe('GET /api/users', () => {
    it('should return 401 without passing token', async () => {
      const response = await request.get('/api/users');
      expect(response.status).toBe(401);
    });

    it('should return 200', async () => {
      const response = await request
        .get('/api/users')
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toBe(200);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should return 401 without passing token', async () => {
      const response = await request.put(`/api/users/${expectedUser.id}`).send({
        firstName: 'Updated',
        lastName: 'Updated',
      });
      expect(response.status).toBe(401);
    });

    it('should return 200', async () => {
      const response = await request
        .put(`/api/users/${expectedUser.id}`)
        .send({
          firstName: 'Updated',
          lastName: 'Updated',
        })
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should return 401 without passing token', async () => {
      const response = await request.delete(`/api/users/${expectedUser.id}`);
      expect(response.status).toBe(401);
    });

    it('should return 200', async () => {
      const response = await request
        .delete(`/api/users/${expectedUser.id}`)
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toBe(200);
    });
  });
});
