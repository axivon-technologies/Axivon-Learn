import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/response';
import {
  enrollLearnerInCourse,
  getLearnerEnrollmentStatus,
  listLearnerEnrollments
} from './enrollments.service';

export async function enrollInCourseHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { created, enrollment } = await enrollLearnerInCourse(
      req.user!.id,
      String(req.params.courseId)
    );
    sendSuccess(res, enrollment, created ? 201 : 200);
  } catch (err) {
    next(err);
  }
}

export async function getCourseEnrollmentStatusHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await getLearnerEnrollmentStatus(req.user!.id, String(req.params.courseId));
    sendSuccess(res, result, 200);
  } catch (err) {
    next(err);
  }
}

export async function listMyEnrollmentsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const enrollments = await listLearnerEnrollments(req.user!.id);
    sendSuccess(res, enrollments, 200);
  } catch (err) {
    next(err);
  }
}
