import { AppError } from '../../middleware/errorHandler';
import {
  queryPublishedCourses,
  findPublishedCourseDetailBySlug
} from './catalog.store';
import { CoursesListQuery } from './courses.validators';

export async function listPublishedCourses(query: CoursesListQuery) {
  const effectiveSearch = query.search || query.q;
  const { items, total } = await queryPublishedCourses({
    category: query.category,
    level: query.level,
    search: effectiveSearch,
    sort: query.sort,
    page: query.page,
    limit: query.limit
  });

  const totalPages = total === 0 ? 0 : Math.ceil(total / query.limit);

  return {
    items,
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages
    }
  };
}

export async function getPublishedCourseBySlug(slug: string) {
  const course = await findPublishedCourseDetailBySlug(slug);
  if (!course) {
    throw new AppError('Course not found.', 404, undefined, 'NOT_FOUND');
  }
  return course;
}
