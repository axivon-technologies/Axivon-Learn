import { z } from 'zod';
import { isValidObjectId } from '../../utils/objectId';

export const progressLessonIdParamSchema = z.object({
  lessonId: z
    .string()
    .trim()
    .refine((val) => isValidObjectId(val), {
      message: 'Invalid lessonId format. Must be a valid 24-character ObjectId.'
    })
});

export const userScopedProgressParamsSchema = z.object({
  userId: z
    .string()
    .trim()
    .refine((val) => isValidObjectId(val), {
      message: 'Invalid userId format. Must be a valid 24-character ObjectId.'
    }),
  lessonId: z
    .string()
    .trim()
    .refine((val) => isValidObjectId(val), {
      message: 'Invalid lessonId format. Must be a valid 24-character ObjectId.'
    })
});

export const userIdProgressParamSchema = z.object({
  userId: z
    .string()
    .trim()
    .refine((val) => isValidObjectId(val), {
      message: 'Invalid userId format. Must be a valid 24-character ObjectId.'
    })
});

export const progressOverviewQuerySchema = z.object({
  courseId: z
    .string()
    .trim()
    .refine((val) => isValidObjectId(val), {
      message: 'Invalid courseId filter format.'
    })
    .optional()
});

export const updateLessonProgressBodySchema = z
  .object({
    status: z.enum(['not_started', 'in_progress', 'completed']).optional(),
    completed: z.boolean().optional(),
    userId: z.string().trim().optional()
  })
  .strict()
  .refine((data) => data.status !== undefined || data.completed !== undefined, {
    message: 'Provide either "status" ("not_started" | "in_progress" | "completed") or "completed" (boolean).'
  });

export type UpdateLessonProgressBody = z.infer<typeof updateLessonProgressBodySchema>;
