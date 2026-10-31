import dotenv from 'dotenv';
import path from 'path';

// Load .env from root workspace or local directory
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config();

export interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  API_PREFIX: string;
  CORS_ORIGIN: string;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  COOKIE_SECRET: string;
}

export const env: EnvConfig = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  API_PREFIX: process.env.API_PREFIX || '/api/v1',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/axivon_learn',
  JWT_SECRET: process.env.JWT_SECRET || 'axivon_learn_development_secret_key_minimum_32_chars',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'axivon_learn_cookie_secret_dev'
};
