import { Router } from 'express';
import { validateRequest } from '../../middleware/validate';
import { categorySlugParamSchema } from './categories.validators';
import { listCategoriesHandler, getCategoryBySlugHandler } from './categories.controller';

export const categoriesRouter = Router();

categoriesRouter.get('/', listCategoriesHandler);
categoriesRouter.get(
  '/:slug',
  validateRequest({ params: categorySlugParamSchema }),
  getCategoryBySlugHandler
);

export default categoriesRouter;
