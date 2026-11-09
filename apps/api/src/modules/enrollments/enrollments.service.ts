import { AppError } from '../../middleware/errorHandler';
import { findPublishedCourseSummaryById } from '../courses/catalog.store';
import {
  enrollUserInPublishedCourse,
  findEnrichedUserEnrollment,
  listEnrichedUserEnrollments
} from './learner.store';

export async function enrollLearnerInCourse(userId: string, courseId: string) {
  const course = await findPublishedCourseSummaryById(courseId);
  if (!course) {
    throw new AppError(
      'Published course not found or unavailable for enrollment.',
      404,
      undefined,
      'NOT_FOUND'
    );
  }

  return enrollUserInPublishedCourse(userId, courseId);
}

export async function getLearnerEnrollmentStatus(userId: string, courseId: string) {
  const course = await findPublishedCourseSummaryById(courseId);
  if (!course) {
    throw new AppError('Course not found.', 404, undefined, 'NOT_FOUND');
  }

  const enrollment = await findEnrichedUserEnrollment(userId, courseId);
  return {
    enrolled: Boolean(enrollment),
    enrollment
  };
}

export async function listLearnerEnrollments(userId: string) {
  return listEnrichedUserEnrollments(userId);
}
