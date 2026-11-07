import { Router } from 'express';
import { validateRequest } from '../../middleware/validate';
import { coursesListQuerySchema, courseSlugParamSchema } from './courses.validators';
import { listCoursesHandler, getCourseBySlugHandler } from './courses.controller';

export const coursesRouter = Router();

coursesRouter.get(
  '/',
  validateRequest({ query: coursesListQuerySchema }),
  listCoursesHandler
);

coursesRouter.get(
  '/:slug',
  validateRequest({ params: courseSlugParamSchema }),
  getCourseBySlugHandler
);

export default coursesRouter;
