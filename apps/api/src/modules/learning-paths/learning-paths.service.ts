import { AppError } from '../../middleware/errorHandler';
import {
  findPublishedLearningPaths,
  findPublishedLearningPathBySlug
} from '../courses/catalog.store';

export async function listPublishedLearningPaths() {
  return findPublishedLearningPaths();
}

export async function getPublishedLearningPathBySlug(slug: string) {
  const path = await findPublishedLearningPathBySlug(slug);
  if (!path) {
    throw new AppError('Learning path not found.', 404, undefined, 'NOT_FOUND');
  }
  return path;
}
