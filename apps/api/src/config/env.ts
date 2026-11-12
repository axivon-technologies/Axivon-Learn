import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load .env from root workspace or local apps/api directory
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config();

const DEV_JWT_SECRET = 'axivon_learn_development_secret_key_minimum_32_chars';
const DEV_REFRESH_SECRET = 'axivon_learn_dev_refresh_secret_key_minimum_32_chars';
const DEV_COOKIE_SECRET = 'axivon_learn_cookie_secret_dev';
const DEV_MONGODB_URI = 'mongodb://localhost:27017/axivon_learn';

export interface EnvConfig {
  NODE_ENV: 'development' | 'test' | 'staging' | 'production';
  PORT: number;
  API_PREFIX: string;
  CORS_ORIGIN: string;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  REFRESH_TOKEN_SECRET: string;
  REFRESH_TOKEN_EXPIRES_IN: string;
  COOKIE_SECRET: string;
}

const rawEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  API_PREFIX: z
    .string()
    .trim()
    .min(1)
    .refine((v) => v.startsWith('/'), { message: 'API_PREFIX must start with "/"' })
    .default('/api/v1'),
  CORS_ORIGIN: z.string().trim().min(1).default('http://localhost:5173'),
  MONGODB_URI: z.string().trim().optional(),
  JWT_SECRET: z.string().trim().optional(),
  JWT_EXPIRES_IN: z.string().trim().min(2).default('1d'),
  REFRESH_TOKEN_SECRET: z.string().trim().optional(),
  REFRESH_TOKEN_EXPIRES_IN: z.string().trim().min(2).default('7d'),
  COOKIE_SECRET: z.string().trim().optional()
});

export function validateEnv(source: NodeJS.ProcessEnv = process.env): EnvConfig {
  const parsed = rawEnvSchema.safeParse(source);
  if (!parsed.success) {
    const formatted = parsed.error.issues
      .map((issue) => `${issue.path.join('.') || 'env'}: ${issue.message}`)
      .join('; ');
    throw new Error(`[Config] Invalid environment configuration: ${formatted}`);
  }

  const data = parsed.data;
  const isProdLike = data.NODE_ENV === 'production';

  if (isProdLike) {
    const missingOrInsecure: string[] = [];
    if (!data.MONGODB_URI) {
      missingOrInsecure.push('MONGODB_URI is required in production');
    }
    if (!data.JWT_SECRET || data.JWT_SECRET.length < 32 || data.JWT_SECRET === DEV_JWT_SECRET) {
      missingOrInsecure.push('JWT_SECRET must be a unique secret of at least 32 characters in production');
    }
    if (
      !data.REFRESH_TOKEN_SECRET ||
      data.REFRESH_TOKEN_SECRET.length < 32 ||
      data.REFRESH_TOKEN_SECRET === DEV_REFRESH_SECRET
    ) {
      missingOrInsecure.push(
        'REFRESH_TOKEN_SECRET must be a unique secret of at least 32 characters in production'
      );
    }
    if (!data.COOKIE_SECRET || data.COOKIE_SECRET.length < 16 || data.COOKIE_SECRET === DEV_COOKIE_SECRET) {
      missingOrInsecure.push('COOKIE_SECRET must be a unique secret of at least 16 characters in production');
    }

    if (missingOrInsecure.length > 0) {
      throw new Error(`[Config] Production security check failed: ${missingOrInsecure.join('; ')}`);
    }
  }

  return {
    NODE_ENV: data.NODE_ENV,
    PORT: data.PORT,
    API_PREFIX: data.API_PREFIX,
    CORS_ORIGIN: data.CORS_ORIGIN,
    MONGODB_URI: data.MONGODB_URI || DEV_MONGODB_URI,
    JWT_SECRET: data.JWT_SECRET || DEV_JWT_SECRET,
    JWT_EXPIRES_IN: data.JWT_EXPIRES_IN,
    REFRESH_TOKEN_SECRET: data.REFRESH_TOKEN_SECRET || DEV_REFRESH_SECRET,
    REFRESH_TOKEN_EXPIRES_IN: data.REFRESH_TOKEN_EXPIRES_IN,
    COOKIE_SECRET: data.COOKIE_SECRET || DEV_COOKIE_SECRET
  };
}

export const env: EnvConfig = validateEnv(process.env);
