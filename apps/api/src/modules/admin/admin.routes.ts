import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validateRequest } from '../../middleware/validate';
import {
  adminIdParamSchema,
  createCategorySchema,
  updateCategorySchema,
  createCourseSchema,
  updateCourseSchema,
  createModuleSchema,
  updateModuleSchema,
  createLessonSchema,
  updateLessonSchema,
  createQuizSchema,
  updateQuizSchema
} from './admin.validators';
import {
  getAdminMetricsHandler,
  adminListCategoriesHandler,
  adminCreateCategoryHandler,
  adminUpdateCategoryHandler,
  adminListCoursesHandler,
  adminGetCourseByIdHandler,
  adminCreateCourseHandler,
  adminUpdateCourseHandler,
  adminCreateModuleHandler,
  adminUpdateModuleHandler,
  adminCreateLessonHandler,
  adminUpdateLessonHandler,
  adminListQuizzesHandler,
  adminCreateQuizHandler,
  adminUpdateQuizHandler
} from './admin.controller';

export const adminRouter = Router();

// Strict RBAC gate: EVERY /api/v1/admin/* route requires valid session + role === 'admin'
adminRouter.use(authenticate, authorize(['admin']));

// Platform Overview & Metrics
adminRouter.get('/overview', getAdminMetricsHandler);
adminRouter.get('/metrics', getAdminMetricsHandler);

// Category CMS
adminRouter.get('/categories', adminListCategoriesHandler);
adminRouter.post(
  '/categories',
  validateRequest({ body: createCategorySchema }),
  adminCreateCategoryHandler
);
adminRouter.patch(
  '/categories/:id',
  validateRequest({ params: adminIdParamSchema, body: updateCategorySchema }),
  adminUpdateCategoryHandler
);

// Course CMS
adminRouter.get('/courses', adminListCoursesHandler);
adminRouter.get(
  '/courses/:id',
  validateRequest({ params: adminIdParamSchema }),
  adminGetCourseByIdHandler
);
adminRouter.post(
  '/courses',
  validateRequest({ body: createCourseSchema }),
  adminCreateCourseHandler
);
adminRouter.patch(
  '/courses/:id',
  validateRequest({ params: adminIdParamSchema, body: updateCourseSchema }),
  adminUpdateCourseHandler
);

// Module CMS
adminRouter.post(
  '/courses/:id/modules',
  validateRequest({ params: adminIdParamSchema, body: createModuleSchema }),
  adminCreateModuleHandler
);
adminRouter.patch(
  '/modules/:id',
  validateRequest({ params: adminIdParamSchema, body: updateModuleSchema }),
  adminUpdateModuleHandler
);

// Lesson CMS
adminRouter.post(
  '/modules/:id/lessons',
  validateRequest({ params: adminIdParamSchema, body: createLessonSchema }),
  adminCreateLessonHandler
);
adminRouter.patch(
  '/lessons/:id',
  validateRequest({ params: adminIdParamSchema, body: updateLessonSchema }),
  adminUpdateLessonHandler
);

// Quiz CMS
adminRouter.get('/quizzes', adminListQuizzesHandler);
adminRouter.post(
  '/quizzes',
  validateRequest({ body: createQuizSchema }),
  adminCreateQuizHandler
);
adminRouter.patch(
  '/quizzes/:id',
  validateRequest({ params: adminIdParamSchema, body: updateQuizSchema }),
  adminUpdateQuizHandler
);

export default adminRouter;
