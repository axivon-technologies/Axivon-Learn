import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name must not exceed 80 characters'),
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .max(160, 'Email address is too long')
    .transform((v) => v.toLowerCase()),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email format')
    .transform((v) => v.toLowerCase()),
  password: z.string().min(1, 'Password is required')
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email format')
    .transform((v) => v.toLowerCase())
});

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(16, 'Invalid or missing password reset token'),
  password: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .max(128, 'New password must not exceed 128 characters')
});

export const refreshTokenBodySchema = z.object({
  refreshToken: z.string().trim().min(10).optional()
});
