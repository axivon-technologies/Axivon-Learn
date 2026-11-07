import { AppError } from '../../middleware/errorHandler';
import {
  queryPublishedProjects,
  findPublishedProjectBySlug
} from '../courses/catalog.store';
import { ProjectsListQuery } from './projects.validators';

export async function listPublishedProjects(query: ProjectsListQuery) {
  const effectiveSearch = query.search || query.q;
  const { items, total } = await queryPublishedProjects({
    category: query.category,
    level: query.level,
    search: effectiveSearch,
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

export async function getPublishedProjectBySlug(slug: string) {
  const project = await findPublishedProjectBySlug(slug);
  if (!project) {
    throw new AppError('Project brief not found.', 404, undefined, 'NOT_FOUND');
  }
  return project;
}
