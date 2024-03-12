import { Pool, QueryResultRow } from 'pg';
import { getDatabaseConfig } from '../common/config';

class Database {
  private db: Pool;
  constructor() {
    this.db = new Pool(getDatabaseConfig());
  }

  async executeQuery<T extends QueryResultRow>(text: string, args?: unknown[]) {
    const client = await this.db.connect();
    try {
      const result = await client.query<T>(text, args);
      return result.rows;
    } finally {
      client.release();
    }
  }
}

const db = new Database();

export default db;
