import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/response';
import { listPublishedCourses, getPublishedCourseBySlug } from './courses.service';
import { CoursesListQuery } from './courses.validators';

export async function listCoursesHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query = req.query as unknown as CoursesListQuery;
    const { items, meta } = await listPublishedCourses(query);
    sendSuccess(res, items, 200, meta);
  } catch (err) {
    next(err);
  }
}

export async function getCourseBySlugHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const course = await getPublishedCourseBySlug(String(req.params.slug));
    sendSuccess(res, course, 200);
  } catch (err) {
    next(err);
  }
}
