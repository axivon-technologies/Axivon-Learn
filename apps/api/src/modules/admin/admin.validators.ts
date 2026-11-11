import { z } from 'zod';
import { isValidObjectId } from '../../utils/objectId';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const objectIdString = (fieldName: string) =>
  z
    .string()
    .trim()
    .refine((val) => isValidObjectId(val), {
      message: `Invalid ${fieldName} format. Must be a valid 24-character ObjectId.`
    });

export const adminIdParamSchema = z.object({
  id: objectIdString('id')
});

// -----------------------------------------------------------------------------
// Category Schemas
// -----------------------------------------------------------------------------
export const createCategorySchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().toLowerCase().min(2).max(80).regex(slugRegex, 'Slug must be kebab-case.'),
  description: z.string().trim().max(500).optional(),
  icon: z.string().trim().max(40).optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
  isActive: z.boolean().optional()
});

export const updateCategorySchema = createCategorySchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for category update.'
  });

// -----------------------------------------------------------------------------
// Course Schemas
// -----------------------------------------------------------------------------
export const createCourseSchema = z.object({
  title: z.string().trim().min(3).max(160),
  slug: z.string().trim().toLowerCase().min(3).max(120).regex(slugRegex, 'Slug must be kebab-case.'),
  summary: z.string().trim().min(10).max(500),
  description: z.string().trim().max(5000).optional(),
  category: z.string().trim().min(2).max(80),
  categoryId: objectIdString('categoryId').optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  language: z.string().trim().min(2).max(40).optional(),
  thumbnailUrl: z.string().trim().max(500).optional(),
  instructorName: z.string().trim().min(2).max(120).optional(),
  sourceAttribution: z.string().trim().min(2).max(240).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  outcomes: z.array(z.string().trim().min(2).max(240)).max(20).optional(),
  prerequisites: z.array(z.string().trim().min(2).max(240)).max(20).optional(),
  estimatedDurationHours: z.number().min(0.5).max(500).optional()
});

export const updateCourseSchema = createCourseSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for course update.'
  });

// -----------------------------------------------------------------------------
// Module Schemas
// -----------------------------------------------------------------------------
export const createModuleSchema = z.object({
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().max(1000).optional(),
  order: z.number().int().min(1).max(999).optional()
});

export const updateModuleSchema = createModuleSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for module update.'
  });

// -----------------------------------------------------------------------------
// Lesson Schemas
// -----------------------------------------------------------------------------
const resourceLinkSchema = z.object({
  title: z.string().trim().min(1).max(160),
  url: z.string().trim().url().max(500)
});

export const createLessonSchema = z.object({
  title: z.string().trim().min(2).max(160),
  slug: z.string().trim().toLowerCase().min(2).max(120).regex(slugRegex, 'Slug must be kebab-case.'),
  description: z.string().trim().max(2000).optional(),
  contentType: z.enum(['video', 'article', 'resource']).optional(),
  videoProvider: z.enum(['youtube', 'vimeo', 'external', 'none']).optional(),
  videoUrl: z.string().trim().max(500).optional(),
  videoEmbedId: z.string().trim().max(64).optional(),
  resourceUrl: z.string().trim().max(500).optional(),
  resourceLinks: z.array(resourceLinkSchema).max(20).optional(),
  sourceAttribution: z.string().trim().min(2).max(240).optional(),
  contentRightsStatus: z.enum(['owned', 'permitted_embed', 'pending_review']).optional(),
  durationMinutes: z.number().int().min(0).max(600).optional(),
  order: z.number().int().min(1).max(999).optional(),
  isRequired: z.boolean().optional(),
  isFreePreview: z.boolean().optional(),
  status: z.enum(['draft', 'published']).optional()
});

export const updateLessonSchema = createLessonSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for lesson update.'
  });

// -----------------------------------------------------------------------------
// Quiz & Question Schemas
// -----------------------------------------------------------------------------
const quizQuestionInputSchema = z
  .object({
    prompt: z.string().trim().min(5).max(500),
    options: z.array(z.string().trim().min(1).max(300)).min(2).max(8),
    correctOptionIndex: z.number().int().min(0),
    explanation: z.string().trim().max(500).optional(),
    order: z.number().int().min(1).max(100).optional()
  })
  .refine((q) => q.correctOptionIndex < q.options.length, {
    message: 'correctOptionIndex must be a valid index within options.',
    path: ['correctOptionIndex']
  });

export const createQuizSchema = z.object({
  courseId: objectIdString('courseId'),
  moduleId: objectIdString('moduleId').optional(),
  lessonId: objectIdString('lessonId').optional(),
  title: z.string().trim().min(3).max(160),
  description: z.string().trim().max(1000).optional(),
  passingScore: z.number().int().min(1).max(100).optional(),
  status: z.enum(['draft', 'published']).optional(),
  questions: z.array(quizQuestionInputSchema).max(50).optional()
});

export const updateQuizSchema = z
  .object({
    title: z.string().trim().min(3).max(160).optional(),
    description: z.string().trim().max(1000).optional(),
    passingScore: z.number().int().min(1).max(100).optional(),
    status: z.enum(['draft', 'published']).optional(),
    questions: z.array(quizQuestionInputSchema).max(50).optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for quiz update.'
  });
