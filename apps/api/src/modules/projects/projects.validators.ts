import { z } from 'zod';

export const projectsListQuerySchema = z.object({
  category: z.string().trim().max(120, 'Category filter is too long').optional(),
  level: z.string().trim().max(60, 'Level filter is too long').optional(),
  search: z.string().trim().max(120, 'Search query is too long').optional(),
  q: z.string().trim().max(120, 'Search query is too long').optional(),
  page: z.coerce.number().int().min(1, 'Page must be at least 1').default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1, 'Limit must be at least 1')
    .max(50, 'Limit must not exceed 50')
    .default(12)
});

export type ProjectsListQuery = z.infer<typeof projectsListQuerySchema>;

export const projectSlugParamSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, 'Project slug is required')
    .max(160, 'Project slug is too long')
    .transform((v) => v.toLowerCase())
});
