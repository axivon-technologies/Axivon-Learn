import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/response';
import { listPublishedProjects, getPublishedProjectBySlug } from './projects.service';
import { ProjectsListQuery } from './projects.validators';

export async function listProjectsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query = req.query as unknown as ProjectsListQuery;
    const { items, meta } = await listPublishedProjects(query);
    sendSuccess(res, items, 200, meta);
  } catch (err) {
    next(err);
  }
}

export async function getProjectBySlugHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const project = await getPublishedProjectBySlug(String(req.params.slug));
    sendSuccess(res, project, 200);
  } catch (err) {
    next(err);
  }
}
