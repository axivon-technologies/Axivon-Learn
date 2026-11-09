import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/response';
import {
  updateOwnLessonProgress,
  getMyProgressSummary,
  getUserProgressSummaryWithOwnership
} from './progress.service';

export async function putLessonProgressHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await updateOwnLessonProgress(
      req.user!,
      String(req.params.lessonId),
      req.body
    );
    sendSuccess(res, result, 200);
  } catch (err) {
    next(err);
  }
}

export async function putUserScopedLessonProgressHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await updateOwnLessonProgress(
      req.user!,
      String(req.params.lessonId),
      req.body,
      String(req.params.userId)
    );
    sendSuccess(res, result, 200);
  } catch (err) {
    next(err);
  }
}

export async function getMyProgressHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const courseId =
      typeof req.query.courseId === 'string' ? req.query.courseId : undefined;
    const overview = await getMyProgressSummary(req.user!.id, courseId);
    sendSuccess(res, overview, 200);
  } catch (err) {
    next(err);
  }
}

export async function getUserProgressByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const courseId =
      typeof req.query.courseId === 'string' ? req.query.courseId : undefined;
    const overview = await getUserProgressSummaryWithOwnership(
      req.user!,
      String(req.params.userId),
      courseId
    );
    sendSuccess(res, overview, 200);
  } catch (err) {
    next(err);
  }
}
