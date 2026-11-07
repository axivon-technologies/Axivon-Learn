import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/response';
import {
  listPublishedLearningPaths,
  getPublishedLearningPathBySlug
} from './learning-paths.service';

export async function listLearningPathsHandler(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const paths = await listPublishedLearningPaths();
    sendSuccess(res, paths, 200);
  } catch (err) {
    next(err);
  }
}

export async function getLearningPathBySlugHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const path = await getPublishedLearningPathBySlug(String(req.params.slug));
    sendSuccess(res, path, 200);
  } catch (err) {
    next(err);
  }
}
