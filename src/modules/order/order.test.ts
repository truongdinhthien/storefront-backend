import supertest from 'supertest';
import app from '../../server';
import ProductModel, { Product } from '../product/product.model';
import UserModel from '../user/user.model';
import { signToken } from '../../common/utils/jwt';
import OrderModel, {
  CreateOrderInput,
  Order,
  OrderStatus,
} from './order.model';

const request = supertest(app);
const productModel = new ProductModel();
const userModel = new UserModel();
const orderModel = new OrderModel();

describe('Order model', () => {
  let order: Order;
  let userId: number;
  let productIds: number[];
  beforeAll(async () => {
    const user = {
      email: 'test@gmail.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'password',
    };
    const products = [
      {
        name: 'Banana',
        price: 20,
        popularity: 100,
      },
      {
        name: 'Apple',
        price: 30,
        popularity: 500,
      },
    ];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashedPassword, ...createdUser } = await userModel.create(user);

    userId = createdUser.id;

    const createdProducts = await Promise.all(
      products.map(productModel.create.bind(productModel)),
    );

    productIds = createdProducts.map(({ id }) => id);

    order = {
      id: 0,
      products: createdProducts.map((product) => ({
        ...product,
        quantity: 5,
      })),
      user: createdUser,
      status: OrderStatus.Active,
    };
  });

  afterAll(async () => {
    await Promise.all([
      userModel.delete(userId),
      ...productIds.map(productModel.delete.bind(productModel)),
    ]);
  });

  it('create method should return new order', async () => {
    const createOrderInput: CreateOrderInput = {
      products: productIds.map((id) => ({
        id,
        quantity: 5,
      })),
      userId,
    };

    const actualOrder = await orderModel.create(createOrderInput);

    order.id = actualOrder.id;
    expect(actualOrder).toEqual(order);
  });

  it('getAll method should return list of orders', async () => {
    const actualOrders = await orderModel.getAll();
    expect(actualOrders).toEqual([order]);
  });

  it('getAll method should return list of orders with correct userId', async () => {
    const actualOrders = await orderModel.getAll({ userId });
    expect(actualOrders).toEqual([order]);
  });

  it('getById method should return order with valid id', async () => {
    const actualOrder = await orderModel.getById(order.id);
    expect(actualOrder).toEqual(order);
  });

  it('getById method should return null with invalid id', async () => {
    const actualOrder = await orderModel.getById(99999);
    expect(actualOrder).toBeNull();
  });

  it('updateStatus method should update status', async () => {
    await orderModel.updateStatus(order.id, {
      status: OrderStatus.Completed,
    });
    const actualOrder = await orderModel.getById(order.id);
    expect(actualOrder!.status).toEqual(OrderStatus.Completed);
  });
});

describe('Order endpoints', () => {
  let token: string;
  let order: Order;
  let userId: number;
  let productIds: number[];

  beforeAll(async () => {
    const user = {
      email: 'test@gmail.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'password',
    };

    const products = [
      {
        name: 'Banana',
        price: 20,
        popularity: 100,
      },
      {
        name: 'Apple',
        price: 30,
        popularity: 500,
      },
    ];

    const response = await request.post('/api/users').send(user);
    const createdUser = response.body.data;
    userId = createdUser.id;
    token = signToken({ authorId: userId });

    const createdProducts = await Promise.all(
      products.map(async (product) => {
        const response = await request
          .post('/api/products')
          .send(product)
          .set('Authorization', 'Bearer ' + token);
        return response.body.data;
      }),
    );

    productIds = createdProducts.map(({ id }) => id);

    order = {
      id: 0,
      products: createdProducts.map((product) => ({
        ...product,
        quantity: 5,
      })),
      user: createdUser,
      status: OrderStatus.Active,
    };
  });

  afterAll(async () => {
    await Promise.all([
      request
        .delete(`/api/users/${userId}`)
        .set('Authorization', 'Bearer ' + token),
      ...productIds.map((id) =>
        request
          .delete(`/api/products/${id}`)
          .set('Authorization', 'Bearer ' + token),
      ),
    ]);
  });

  describe('POST /api/orders', () => {
    it('should return 401 without passing token', async () => {
      const createOrderInput: CreateOrderInput = {
        products: productIds.map((id) => ({
          id,
          quantity: 5,
        })),
        userId,
      };
      const response = await request.post(`/api/orders`).send(createOrderInput);
      expect(response.status).toBe(401);
    });

    it('should return 200', async () => {
      const createOrderInput: CreateOrderInput = {
        products: productIds.map((id) => ({
          id,
          quantity: 5,
        })),
        userId,
      };
      const response = await request
        .post('/api/orders')
        .send(createOrderInput)
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toBe(200);

      order.id = response.body.data.id;
    });
  });

  describe('GET /api/orders', () => {
    it('should return 401 without passing token', async () => {
      const response = await request.get(`/api/orders`).send(order);
      expect(response.status).toBe(401);
    });

    it('should return 200', async () => {
      const response = await request
        .get('/api/orders')
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([order]);
    });

    it('should return 200 with userId param', async () => {
      const response = await request
        .get(`/api/orders?userId=${userId}`)
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([order]);
    });

    it('should return empty with invalid userId param', async () => {
      const response = await request
        .get(`/api/orders?userId=9999`)
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });
  });

  describe('PUT /api/orders/:id', () => {
    const updateStatus = {
      status: OrderStatus.Completed,
    };
    it('should return 401 without passing token', async () => {
      const response = await request
        .put(`/api/orders/${order.id}/status`)
        .send(updateStatus);
      expect(response.status).toBe(401);
    });

    it('should return 200', async () => {
      const response = await request
        .put(`/api/orders/${order.id}/status`)
        .send(updateStatus)
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toBe(200);
    });
  });
});
