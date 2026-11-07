import { Router } from 'express';
import { validateRequest } from '../../middleware/validate';
import { projectsListQuerySchema, projectSlugParamSchema } from './projects.validators';
import { listProjectsHandler, getProjectBySlugHandler } from './projects.controller';

export const projectsRouter = Router();

projectsRouter.get(
  '/',
  validateRequest({ query: projectsListQuerySchema }),
  listProjectsHandler
);

projectsRouter.get(
  '/:slug',
  validateRequest({ params: projectSlugParamSchema }),
  getProjectBySlugHandler
);

export default projectsRouter;
