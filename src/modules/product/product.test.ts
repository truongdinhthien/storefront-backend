import supertest from 'supertest';
import app from '../../server';
import ProductModel, { Product } from './product.model';
import { signToken } from '../../common/utils/jwt';

const request = supertest(app);
const productModel = new ProductModel();

describe('Product model', () => {
  let dummyProducts: Product[] | null = null;
  beforeAll(async () => {
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
      {
        name: 'Peach',
        price: 15,
        popularity: 10,
      },
    ];
    dummyProducts = await Promise.all(
      products.map(productModel.create.bind(productModel)),
    );
  });

  it('getAll method should return list of products', async () => {
    const actualProducts = await productModel.getAll();
    actualProducts.forEach((product) => {
      const foundProduct = dummyProducts?.find(({ id }) => product.id === id);
      if (foundProduct) {
        expect(foundProduct.name).toEqual(product.name);
        expect(foundProduct.price).toEqual(product.price);
        expect(foundProduct.popularity).toEqual(product.popularity);
      }
    });
  });

  it('getById method should return product with valid id', async () => {
    const expectedProduct = dummyProducts![0];
    const actualProducts = await productModel.getById(expectedProduct.id);

    expect(actualProducts).not.toBeNull();
    if (actualProducts) {
      expect(actualProducts.name).toEqual(expectedProduct.name);
      expect(actualProducts.price).toEqual(expectedProduct.price);
      expect(actualProducts.popularity).toEqual(expectedProduct.popularity);
    }
  });

  it('getById method should return null with invalid id', async () => {
    const actualProducts = await productModel.getById(99999);
    expect(actualProducts).toBeNull();
  });

  it('create method should return new product', async () => {
    const expectedProduct = {
      name: 'Grape',
      price: 25,
      popularity: 30,
    };
    const actualProducts = await productModel.create(expectedProduct);

    expect(actualProducts.name).toEqual(expectedProduct.name);
    expect(actualProducts.price).toEqual(expectedProduct.price);
    expect(actualProducts.popularity).toEqual(expectedProduct.popularity);

    await productModel.delete(actualProducts.id);
  });

  it('delete method should delete exist product', async () => {
    const expectedProduct = {
      name: 'Grape',
      price: 25,
      popularity: 30,
    };
    const actualProducts = await productModel.create(expectedProduct);
    await productModel.delete(actualProducts.id);

    await expectAsync(productModel.getById(actualProducts.id)).toBeResolvedTo(
      null,
    );
  });

  it('update method should update product', async () => {
    const actualProducts = await productModel.create({
      name: 'Grape',
      price: 25,
      popularity: 30,
    });

    const expectedProduct = await productModel.update(actualProducts.id, {
      ...actualProducts,
      price: 250,
    });

    actualProducts.price = 250;

    expect(actualProducts.name).toEqual(expectedProduct.name);
    expect(actualProducts.price).toEqual(expectedProduct.price);
    expect(actualProducts.popularity).toEqual(expectedProduct.popularity);

    await productModel.delete(actualProducts.id);
  });

  afterAll(async () => {
    await Promise.allSettled(
      (dummyProducts || []).map(({ id }) => productModel.delete(id)),
    );
  });
});

describe('Product endpoints', () => {
  let token: string;
  let userId: number;

  const product = {
    id: 0,
    name: 'Banana',
    price: 20,
    popularity: 100,
  };

  beforeAll(async () => {
    const user = {
      email: 'test@gmail.com',
      firstName: 'Test',
      lastName: 'Test',
      password: 'password',
    };

    const response = await request.post('/api/users').send(user);
    userId = response.body.data.id;
    token = signToken({ authorId: userId });
  });

  afterAll(async () => {
    await request
      .delete(`/api/users/${userId}`)
      .set('Authorization', 'Bearer ' + token);
  });

  describe('POST /api/products', () => {
    it('should return 401 without passing token', async () => {
      const response = await request.post(`/api/products`).send(product);
      expect(response.status).toBe(401);
    });

    it('should return 200', async () => {
      const response = await request
        .post('/api/products')
        .send(product)
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toBe(200);

      product.id = response.body.data.id;
    });
  });

  describe('GET /api/products', () => {
    it('should return 200', async () => {
      const response = await request.get('/api/products');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return 200', async () => {
      const response = await request.get(`/api/products/${product.id}`);
      expect(response.status).toBe(200);
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should return 401 without passing token', async () => {
      const response = await request.put(`/api/products/${product.id}`).send({
        name: 'Apple',
        price: 20,
        popularity: 15,
      });
      expect(response.status).toBe(401);
    });

    it('should return 200', async () => {
      const response = await request
        .put(`/api/products/${product.id}`)
        .send({
          name: 'Apple',
          price: 20,
          popularity: 15,
        })
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should return 401 without passing token', async () => {
      const response = await request.delete(`/api/products/${product.id}`);
      expect(response.status).toBe(401);
    });

    it('should return 200', async () => {
      const response = await request
        .delete(`/api/products/${product.id}`)
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toBe(200);
    });
  });
});
