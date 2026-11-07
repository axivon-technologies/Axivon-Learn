import { AppError } from '../../middleware/errorHandler';
import {
  findActiveCategoriesWithCounts,
  findActiveCategoryBySlug
} from '../courses/catalog.store';

export async function listActiveCategories() {
  return findActiveCategoriesWithCounts();
}

export async function getActiveCategoryBySlug(slug: string) {
  const category = await findActiveCategoryBySlug(slug);
  if (!category) {
    throw new AppError('Category not found.', 404, undefined, 'NOT_FOUND');
  }
  return category;
}
