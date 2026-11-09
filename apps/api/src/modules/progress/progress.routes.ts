import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validateRequest } from '../../middleware/validate';
import {
  progressLessonIdParamSchema,
  userScopedProgressParamsSchema,
  userIdProgressParamSchema,
  progressOverviewQuerySchema,
  updateLessonProgressBodySchema
} from './progress.validators';
import {
  putLessonProgressHandler,
  putUserScopedLessonProgressHandler,
  getMyProgressHandler,
  getUserProgressByIdHandler
} from './progress.controller';

// Mounted at /api/v1/lessons (handles PUT /api/v1/lessons/:lessonId/progress)
export const lessonProgressRouter = Router();
lessonProgressRouter.put(
  '/:lessonId/progress',
  authenticate,
  validateRequest({
    params: progressLessonIdParamSchema,
    body: updateLessonProgressBodySchema
  }),
  putLessonProgressHandler
);

// Mounted at /api/v1/me/progress
export const myProgressRouter = Router();
myProgressRouter.get(
  '/',
  authenticate,
  validateRequest({ query: progressOverviewQuerySchema }),
  getMyProgressHandler
);

// Mounted at /api/v1/users (ownership-checked progress endpoints)
export const userProgressRouter = Router();
userProgressRouter.get(
  '/:userId/progress',
  authenticate,
  validateRequest({
    params: userIdProgressParamSchema,
    query: progressOverviewQuerySchema
  }),
  getUserProgressByIdHandler
);
userProgressRouter.put(
  '/:userId/lessons/:lessonId/progress',
  authenticate,
  validateRequest({
    params: userScopedProgressParamsSchema,
    body: updateLessonProgressBodySchema
  }),
  putUserScopedLessonProgressHandler
);

export default myProgressRouter;
