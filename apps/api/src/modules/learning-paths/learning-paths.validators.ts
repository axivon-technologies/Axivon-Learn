import { z } from 'zod';

export const learningPathSlugParamSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, 'Learning path slug is required')
    .max(160, 'Learning path slug is too long')
    .transform((v) => v.toLowerCase())
});
