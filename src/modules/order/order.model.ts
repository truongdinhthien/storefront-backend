import db from '../../database';
import { Product } from '../product/product.model';
import { User, UserTable, transformUser } from '../user/user.model';

export enum OrderStatus {
  Active = 'active',
  Completed = 'completed',
  Canceled = 'canceled',
}

export interface OrderTable {
  id: number;
  user_id: number;
  status: OrderStatus;
}

export interface Order {
  id: number;
  status: OrderStatus;
  user: Omit<User, 'hashedPassword'>;
  products: Array<
    Product & {
      quantity: number;
    }
  >;
}

export interface OrderItem {
  orderId: number;
  productId: number;
  quantity: number;
}

export interface GetOrderQueryResponse {
  id: number;
  status: OrderStatus;
  user: UserTable;
  products: Array<{
    information: Product;
    quantity: number;
  }>;
}

export interface CreateOrderInput {
  status?: OrderStatus;
  userId: number;
  products: Array<{
    id: number;
    quantity: number;
  }>;
}

export interface UpdateOrderStatusInput {
  status: string;
}

export const transformGetOrderQuery = (data: GetOrderQueryResponse): Order => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { hashedPassword, ...user } = transformUser(data.user);
  return {
    id: data.id,
    status: data.status,
    user: user,
    products: data.products.map((p) => ({
      ...p.information,
      quantity: p.quantity,
    })),
  };
};

class OrderModel {
  async getAll(params: { userId?: number } = {}): Promise<Order[]> {
    const { userId } = params;
    const result = await db.executeQuery<GetOrderQueryResponse>(
      ` SELECT orders.id, orders.status, TO_JSON(users) AS user,
          ARRAY_TO_JSON(ARRAY_AGG(
            json_build_object(
              'information', products.*,
              'quantity', order_items.quantity
            )
          )) AS products
        FROM orders
        INNER JOIN users ON orders.user_id = users.id
        INNER JOIN order_items ON orders.id = order_items.order_id
        INNER JOIN products ON order_items.product_id = products.id
        ${userId ? `WHERE orders.user_id = ${userId}` : ''}
        GROUP BY orders.id, users
      `,
    );
    return result.map(transformGetOrderQuery);
  }

  async getById(id: number): Promise<Order | null> {
    const result = await db.executeQuery<GetOrderQueryResponse>(
      ` SELECT orders.id, orders.status, TO_JSON(users) AS user,
          ARRAY_TO_JSON(ARRAY_AGG(
            json_build_object(
              'information', products.*,
              'quantity', order_items.quantity
            )
          )) AS products
        FROM orders
        INNER JOIN users ON orders.user_id = users.id
        INNER JOIN order_items ON orders.id = order_items.order_id
        INNER JOIN products ON order_items.product_id = products.id
        WHERE orders.id = $1
        GROUP BY orders.id, users
      `,
      [id],
    );
    if (!result.length) return null;
    return transformGetOrderQuery(result[0]);
  }

  async create(data: CreateOrderInput): Promise<Order> {
    const { status = OrderStatus.Active, userId, products } = data;

    const client = await db.instance.connect();
    try {
      await client.query('BEGIN');
      const result = await client.query<{ id: number }>(
        'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING id',
        [status, userId],
      );
      const orderId = Number(result.rows[0].id);
      await Promise.all(
        products.map(async (product) => {
          await client.query(
            'INSERT INTO order_items (order_id, product_id, quantity) VALUES($1, $2, $3)',
            [orderId, product.id, product.quantity],
          );
        }),
      );
      await client.query('COMMIT');
      const order = (await this.getById(orderId))!;
      return order;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async updateStatus(id: number, data: UpdateOrderStatusInput): Promise<Order> {
    const result = await db.executeQuery<{ id: number }>(
      'UPDATE orders SET status=$2 WHERE id=$1 RETURNING id',
      [id, data.status],
    );
    return (await this.getById(Number(result[0].id)))!;
  }
}

export default OrderModel;
