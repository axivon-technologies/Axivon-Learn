import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validateRequest } from '../../middleware/validate';
import { courseIdParamSchema } from './enrollments.validators';
import {
  enrollInCourseHandler,
  getCourseEnrollmentStatusHandler,
  listMyEnrollmentsHandler
} from './enrollments.controller';

// Mounted at /api/v1/enrollments AND /api/v1/me/enrollments
export const enrollmentsRouter = Router();
enrollmentsRouter.use(authenticate);
enrollmentsRouter.get('/', listMyEnrollmentsHandler);

// Course-scoped enrollment routes mounted at /api/v1/courses
export const courseEnrollmentsRouter = Router();
courseEnrollmentsRouter.post(
  '/:courseId/enroll',
  authenticate,
  validateRequest({ params: courseIdParamSchema }),
  enrollInCourseHandler
);
courseEnrollmentsRouter.get(
  '/:courseId/enrollment',
  authenticate,
  validateRequest({ params: courseIdParamSchema }),
  getCourseEnrollmentStatusHandler
);

export default enrollmentsRouter;
