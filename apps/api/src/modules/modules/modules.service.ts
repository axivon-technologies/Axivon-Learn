import { AppError } from '../../middleware/errorHandler';
import { findOrderedModulesWithLessonsByCourseId } from '../courses/catalog.store';

export async function listCourseModulesOutline(courseId: string) {
  const modules = await findOrderedModulesWithLessonsByCourseId(courseId);
  if (!modules) {
    throw new AppError('Published course not found.', 404, undefined, 'NOT_FOUND');
  }
  return modules;
}
