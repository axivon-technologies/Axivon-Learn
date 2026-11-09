import { AppError } from '../../middleware/errorHandler';
import { AuthenticatedUser } from '../../middleware/authenticate';
import { LessonProgressStatus } from '../../database/models/LessonProgress';
import { findPublishedLessonWithCourseById } from '../courses/catalog.store';
import {
  isUserEnrolledInCourse,
  upsertUserLessonProgress,
  getAuthoritativeUserProgressOverview
} from '../enrollments/learner.store';
import { UpdateLessonProgressBody } from './progress.validators';

export async function updateOwnLessonProgress(
  requester: AuthenticatedUser,
  lessonId: string,
  body: UpdateLessonProgressBody,
  explicitTargetUserId?: string
) {
  // Enforce strict horizontal ownership: learners must never modify another user's progress
  const targetUserId = explicitTargetUserId || body.userId || requester.id;
  if (targetUserId !== requester.id) {
    throw new AppError(
      'Access forbidden. You cannot modify another learner\'s progress.',
      403,
      undefined,
      'FORBIDDEN'
    );
  }

  const resolved = await findPublishedLessonWithCourseById(lessonId);
  if (!resolved) {
    throw new AppError('Lesson not found.', 404, undefined, 'NOT_FOUND');
  }

  const { lesson, course } = resolved;

  const enrolled = await isUserEnrolledInCourse(requester.id, course.id);
  if (!enrolled) {
    throw new AppError(
      'You must enroll in this course before saving lesson progress.',
      403,
      undefined,
      'FORBIDDEN'
    );
  }

  const resolvedStatus: LessonProgressStatus =
    body.status !== undefined
      ? body.status
      : body.completed
        ? 'completed'
        : 'in_progress';

  return upsertUserLessonProgress(requester.id, course.id, lesson.id, resolvedStatus);
}

export async function getMyProgressSummary(userId: string, courseId?: string) {
  return getAuthoritativeUserProgressOverview(userId, courseId);
}

export async function getUserProgressSummaryWithOwnership(
  requester: AuthenticatedUser,
  targetUserId: string,
  courseId?: string
) {
  if (requester.role !== 'admin' && requester.id !== targetUserId) {
    throw new AppError(
      'Access forbidden. You can only view your own learning progress.',
      403,
      undefined,
      'FORBIDDEN'
    );
  }
  return getAuthoritativeUserProgressOverview(targetUserId, courseId);
}
