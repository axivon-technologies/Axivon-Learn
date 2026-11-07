import { Router } from 'express';
import { validateRequest } from '../../middleware/validate';
import { learningPathSlugParamSchema } from './learning-paths.validators';
import {
  listLearningPathsHandler,
  getLearningPathBySlugHandler
} from './learning-paths.controller';

export const learningPathsRouter = Router();

learningPathsRouter.get('/', listLearningPathsHandler);
learningPathsRouter.get(
  '/:slug',
  validateRequest({ params: learningPathSlugParamSchema }),
  getLearningPathBySlugHandler
);

export default learningPathsRouter;
