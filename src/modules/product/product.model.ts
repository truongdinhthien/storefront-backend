import db from '../../database';

export interface ProductTable {
  id: number;
  name: string;
  price: number;
  popularity: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  popularity: number;
}

export interface CreateProductInput extends Omit<Product, 'id' | 'popularity'> {
  popularity?: number;
}

export interface UpdateProductInput extends Omit<Product, 'id' | 'popularity'> {
  popularity?: number;
}

export const transformTable = (productTable: ProductTable): Product => {
  return {
    id: productTable.id,
    name: productTable.name,
    price: productTable.price,
    popularity: productTable.popularity,
  };
};

class ProductModel {
  async getAll(): Promise<Product[]> {
    const result = await db.executeQuery<ProductTable>(
      'SELECT * FROM products',
    );
    return result.map(transformTable);
  }

  async getById(id: number): Promise<Product | null> {
    const result = await db.executeQuery<ProductTable>(
      'SELECT * FROM products WHERE id = $1',
      [id],
    );
    if (!result.length) return null;
    return transformTable(result[0]);
  }

  async create(data: CreateProductInput): Promise<Product> {
    const { name, price, popularity = 0 } = data;

    const result = await db.executeQuery<ProductTable>(
      'INSERT INTO products (name, price, popularity) VALUES($1, $2, $3) RETURNING *',
      [name, price, popularity],
    );

    return transformTable(result[0]);
  }

  async delete(id: number): Promise<boolean> {
    await db.executeQuery('DELETE FROM products WHERE id=($1)', [id]);
    return true;
  }

  async update(id: number, data: UpdateProductInput): Promise<Product> {
    const { name, price, popularity = 0 } = data;
    const result = await db.executeQuery<ProductTable>(
      'UPDATE products SET name = $1, price = $2, popularity = $3 WHERE id = $4 RETURNING *',
      [name, price, popularity, id],
    );
    return transformTable(result[0]);
  }
}

export default ProductModel;
