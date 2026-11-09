import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/response';
import { listCourseLessonsForViewer, getLessonDetailForViewer } from './lessons.service';

export async function listCourseLessonsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await listCourseLessonsForViewer(String(req.params.courseId), req.user);
    sendSuccess(res, result, 200);
  } catch (err) {
    next(err);
  }
}

export async function getLessonByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const lesson = await getLessonDetailForViewer(String(req.params.lessonId), req.user);
    sendSuccess(res, lesson, 200);
  } catch (err) {
    next(err);
  }
}
