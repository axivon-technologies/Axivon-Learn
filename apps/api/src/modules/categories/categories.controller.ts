import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/response';
import { listActiveCategories, getActiveCategoryBySlug } from './categories.service';

export async function listCategoriesHandler(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const categories = await listActiveCategories();
    sendSuccess(res, categories, 200);
  } catch (err) {
    next(err);
  }
}

export async function getCategoryBySlugHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const category = await getActiveCategoryBySlug(String(req.params.slug));
    sendSuccess(res, category, 200);
  } catch (err) {
    next(err);
  }
}
