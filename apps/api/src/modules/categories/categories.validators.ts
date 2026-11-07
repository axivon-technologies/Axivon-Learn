import { z } from 'zod';

export const categorySlugParamSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, 'Category slug is required')
    .max(120, 'Category slug is too long')
    .transform((v) => v.toLowerCase())
});
