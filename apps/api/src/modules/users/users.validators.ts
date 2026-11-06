import { z } from 'zod';

/**
 * Strictly restricts profile updates to safe learner-editable fields (`name`).
 * Uses `.strict()` so attempts to inject `role`, `isActive`, or `passwordHash`
 * are explicitly rejected with 400 VALIDATION_ERROR.
 */
export const updateOwnProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(80, 'Name must not exceed 80 characters')
  })
  .strict();

export const changeOwnPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .max(128, 'New password must not exceed 128 characters')
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from your current password.',
    path: ['newPassword']
  });
