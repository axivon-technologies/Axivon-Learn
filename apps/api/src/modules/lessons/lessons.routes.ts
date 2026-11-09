import { Router } from 'express';
import { optionalAuthenticate } from '../../middleware/authenticate';
import { validateRequest } from '../../middleware/validate';
import { lessonIdParamSchema, lessonCourseIdParamSchema } from './lessons.validators';
import { listCourseLessonsHandler, getLessonByIdHandler } from './lessons.controller';

// Mounted at /api/v1/lessons
export const lessonsRouter = Router();
lessonsRouter.get(
  '/:lessonId',
  optionalAuthenticate,
  validateRequest({ params: lessonIdParamSchema }),
  getLessonByIdHandler
);

// Course-scoped lesson navigation mounted at /api/v1/courses
export const courseLessonsRouter = Router();
courseLessonsRouter.get(
  '/:courseId/lessons',
  optionalAuthenticate,
  validateRequest({ params: lessonCourseIdParamSchema }),
  listCourseLessonsHandler
);

export default lessonsRouter;
