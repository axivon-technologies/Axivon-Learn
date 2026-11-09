import { Router } from 'express';
import { validateRequest } from '../../middleware/validate';
import { moduleCourseIdParamSchema } from './modules.validators';
import { listCourseModulesHandler } from './modules.controller';

// Course-scoped module routes mounted at /api/v1/courses
export const courseModulesRouter = Router();

courseModulesRouter.get(
  '/:courseId/modules',
  validateRequest({ params: moduleCourseIdParamSchema }),
  listCourseModulesHandler
);

export default courseModulesRouter;
