import dotenv from 'dotenv';
import { PoolConfig } from 'pg';

dotenv.config();

type Config = {
  NODE_ENV: 'development' | 'test' | 'staging' | 'production';

  PORT: number;

  DB_USER: string;
  DB_HOST: string;
  DB_NAME: string;
  DB_PASSWORD: string;
  DB_PORT: number;
  DB_SSL: boolean;

  DB_USER_TEST: string;
  DB_HOST_TEST: string;
  DB_NAME_TEST: string;
  DB_PASSWORD_TEST: string;
  DB_PORT_TEST: number;
  DB_SSL_TEST: boolean;
};

const CONFIG = {
  NODE_ENV: (process.env.NODE_ENV || 'development').trim(),

  PORT: Number(process.env.PORT || 5500),

  DB_USER: process.env.DB_USER?.trim(),
  DB_HOST: process.env.DB_HOST?.trim(),
  DB_NAME: process.env.DB_NAME?.trim(),
  DB_PASSWORD: process.env.DB_PASSWORD?.trim(),
  DB_PORT: Number(process.env.DB_PORT || 5432),
  DB_SSL: process.env.DB_SSL === 'true',

  DB_USER_TEST: process.env.DB_USER_TEST?.trim(),
  DB_HOST_TEST: process.env.DB_HOST_TEST?.trim(),
  DB_NAME_TEST: process.env.DB_NAME_TEST?.trim(),
  DB_PASSWORD_TEST: process.env.DB_PASSWORD_TEST?.trim(),
  DB_PORT_TEST: Number(process.env.DB_PORT_TEST || 5432),
  DB_SSL_TEST: process.env.DB_SSL === 'true',
} as Config;

export const getDatabaseConfig = (): PoolConfig => {
  if (CONFIG.NODE_ENV === 'test') {
    return {
      user: CONFIG.DB_USER_TEST,
      host: CONFIG.DB_HOST_TEST,
      database: CONFIG.DB_NAME_TEST,
      password: CONFIG.DB_PASSWORD_TEST,
      port: CONFIG.DB_PORT_TEST,
      ssl: CONFIG.DB_SSL_TEST,
    };
  }

  return {
    user: CONFIG.DB_USER,
    host: CONFIG.DB_HOST,
    database: CONFIG.DB_NAME,
    password: CONFIG.DB_PASSWORD,
    port: CONFIG.DB_PORT,
    ssl: CONFIG.DB_SSL,
  };
};

export default CONFIG;
