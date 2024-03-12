import db from '.';

class BaseModel<T extends unknown[]> {
  protected modelName = '';
  async getAll() {
    const client = await db.connect();
    try {
      const result = await client.query<T>(`SELECT * FROM ${this.modelName}`);
      return result.rows;
    } finally {
      client.release();
    }
  }
}
