import dotenv from 'dotenv';

dotenv.config();

type Config = {
  NODE_ENV: 'development' | 'test' | 'staging' | 'production';

  PORT: number;

  DB_USER: string;
  DB_HOST: string;
  DB_NAME: string;
  DB_PASSWORD: string;
  DB_PORT: string;

  DB_USER_TEST: string;
  DB_HOST_TEST: string;
  DB_NAME_TEST: string;
  DB_PASSWORD_TEST: string;
  DB_PORT_TEST: string;
};

const CONFIG = {
  NODE_ENV: (process.env.NODE_ENV || 'development').trim(),

  PORT: Number(process.env.PORT || 5500),

  DB_USER: process.env.DB_USER?.trim(),
  DB_HOST: process.env.DB_HOST?.trim(),
  DB_NAME: process.env.DB_NAME?.trim(),
  DB_PASSWORD: process.env.DB_PASSWORD?.trim(),
  DB_PORT: process.env.DB_PORT5432?.trim(),

  DB_USER_TEST: process.env.DB_USER_TEST?.trim(),
  DB_HOST_TEST: process.env.DB_HOST_TEST?.trim(),
  DB_NAME_TEST: process.env.DB_NAME_TEST?.trim(),
  DB_PASSWORD_TEST: process.env.DB_PASSWORD_TEST?.trim(),
  DB_PORT_TEST: process.env.DB_PORT_TEST5432?.trim(),
} as Config;

export default CONFIG;
