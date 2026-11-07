import { z } from 'zod';

export const coursesListQuerySchema = z.object({
  category: z.string().trim().max(120, 'Category filter is too long').optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  search: z.string().trim().max(120, 'Search query is too long').optional(),
  q: z.string().trim().max(120, 'Search query is too long').optional(),
  sort: z.enum(['newest', 'title', 'duration']).default('newest'),
  page: z.coerce.number().int().min(1, 'Page must be at least 1').default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1, 'Limit must be at least 1')
    .max(50, 'Limit must not exceed 50')
    .default(12)
});

export type CoursesListQuery = z.infer<typeof coursesListQuerySchema>;

export const courseSlugParamSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, 'Course slug is required')
    .max(160, 'Course slug is too long')
    .transform((v) => v.toLowerCase())
});
