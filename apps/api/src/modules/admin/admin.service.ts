import { AppError } from '../../middleware/errorHandler';
import {
  countCatalogMetrics,
  adminListAllCategories,
  adminCreateCategory,
  adminUpdateCategoryById,
  adminListAllCourses,
  adminGetCourseDetailById,
  adminCreateCourse,
  adminUpdateCourseById,
  adminCreateModuleForCourse,
  adminUpdateModuleById,
  adminCreateLessonForModule,
  adminUpdateLessonById
} from '../courses/catalog.store';
import { countPlatformUsers } from '../users/user.store';
import { countPlatformEnrollments } from '../enrollments/learner.store';
import {
  countQuizMetrics,
  adminListAllQuizzes,
  adminCreateQuizWithQuestions,
  adminUpdateQuizById
} from '../quizzes/quizzes.store';

function logAdminAudit(adminId: string, action: string, targetId: string): void {
  // Sanitized operational audit log (never logs passwords, tokens, or PII)
  console.info(`[ADMIN AUDIT] admin=${adminId} action=${action} target=${targetId}`);
}

export async function getAdminPlatformMetrics() {
  const [catalog, users, totalEnrollments, quizzes] = await Promise.all([
    countCatalogMetrics(),
    countPlatformUsers(),
    countPlatformEnrollments(),
    countQuizMetrics()
  ]);

  return {
    ...catalog,
    ...users,
    totalEnrollments,
    ...quizzes
  };
}

// -----------------------------------------------------------------------------
// Category Admin Service
// -----------------------------------------------------------------------------
export async function listCategoriesForAdmin() {
  return adminListAllCategories();
}

export async function createCategoryAsAdmin(
  adminId: string,
  input: Parameters<typeof adminCreateCategory>[0]
) {
  const created = await adminCreateCategory(input);
  logAdminAudit(adminId, 'CREATE_CATEGORY', created.id);
  return created;
}

export async function updateCategoryAsAdmin(
  adminId: string,
  categoryId: string,
  patch: Parameters<typeof adminUpdateCategoryById>[1]
) {
  const updated = await adminUpdateCategoryById(categoryId, patch);
  if (!updated) {
    throw new AppError('Category not found.', 404, undefined, 'NOT_FOUND');
  }
  logAdminAudit(adminId, 'UPDATE_CATEGORY', updated.id);
  return updated;
}

// -----------------------------------------------------------------------------
// Course, Module & Lesson Admin Service
// -----------------------------------------------------------------------------
export async function listCoursesForAdmin() {
  return adminListAllCourses();
}

export async function getCourseDetailForAdmin(courseId: string) {
  const course = await adminGetCourseDetailById(courseId);
  if (!course) {
    throw new AppError('Course not found.', 404, undefined, 'NOT_FOUND');
  }
  return course;
}

export async function createCourseAsAdmin(
  adminId: string,
  input: Parameters<typeof adminCreateCourse>[0]
) {
  const created = await adminCreateCourse(input);
  logAdminAudit(adminId, 'CREATE_COURSE', created.id);
  return created;
}

export async function updateCourseAsAdmin(
  adminId: string,
  courseId: string,
  patch: Parameters<typeof adminUpdateCourseById>[1]
) {
  const updated = await adminUpdateCourseById(courseId, patch);
  if (!updated) {
    throw new AppError('Course not found.', 404, undefined, 'NOT_FOUND');
  }
  logAdminAudit(adminId, `UPDATE_COURSE(status=${updated.status})`, updated.id);
  return updated;
}

export async function createModuleAsAdmin(
  adminId: string,
  courseId: string,
  input: Parameters<typeof adminCreateModuleForCourse>[1]
) {
  const created = await adminCreateModuleForCourse(courseId, input);
  if (!created) {
    throw new AppError('Course not found.', 404, undefined, 'NOT_FOUND');
  }
  logAdminAudit(adminId, 'CREATE_MODULE', created.id);
  return created;
}

export async function updateModuleAsAdmin(
  adminId: string,
  moduleId: string,
  patch: Parameters<typeof adminUpdateModuleById>[1]
) {
  const updated = await adminUpdateModuleById(moduleId, patch);
  if (!updated) {
    throw new AppError('Module not found.', 404, undefined, 'NOT_FOUND');
  }
  logAdminAudit(adminId, 'UPDATE_MODULE', updated.id);
  return updated;
}

export async function createLessonAsAdmin(
  adminId: string,
  moduleId: string,
  input: Parameters<typeof adminCreateLessonForModule>[1]
) {
  const created = await adminCreateLessonForModule(moduleId, input);
  if (!created) {
    throw new AppError('Parent module not found.', 404, undefined, 'NOT_FOUND');
  }
  logAdminAudit(adminId, 'CREATE_LESSON', created.id);
  return created;
}

export async function updateLessonAsAdmin(
  adminId: string,
  lessonId: string,
  patch: Parameters<typeof adminUpdateLessonById>[1]
) {
  const updated = await adminUpdateLessonById(lessonId, patch);
  if (!updated) {
    throw new AppError('Lesson not found.', 404, undefined, 'NOT_FOUND');
  }
  logAdminAudit(adminId, 'UPDATE_LESSON', updated.id);
  return updated;
}

// -----------------------------------------------------------------------------
// Quiz Admin Service
// -----------------------------------------------------------------------------
export async function listQuizzesForAdmin() {
  return adminListAllQuizzes();
}

export async function createQuizAsAdmin(
  adminId: string,
  input: Parameters<typeof adminCreateQuizWithQuestions>[0]
) {
  if (
    input.questions &&
    input.questions.length > 0 &&
    input.passingScore !== undefined &&
    input.passingScore > input.questions.length
  ) {
    throw new AppError(
      'passingScore cannot exceed the total number of submitted questions.',
      400,
      undefined,
      'VALIDATION_ERROR'
    );
  }

  const created = await adminCreateQuizWithQuestions(input);
  if (!created) {
    throw new AppError('Parent course not found.', 404, undefined, 'NOT_FOUND');
  }
  logAdminAudit(adminId, 'CREATE_QUIZ', created.id);
  return created;
}

export async function updateQuizAsAdmin(
  adminId: string,
  quizId: string,
  patch: Parameters<typeof adminUpdateQuizById>[1]
) {
  if (
    patch.questions &&
    patch.questions.length > 0 &&
    patch.passingScore !== undefined &&
    patch.passingScore > patch.questions.length
  ) {
    throw new AppError(
      'passingScore cannot exceed the total number of submitted questions.',
      400,
      undefined,
      'VALIDATION_ERROR'
    );
  }

  const updated = await adminUpdateQuizById(quizId, patch);
  if (!updated) {
    throw new AppError('Quiz not found.', 404, undefined, 'NOT_FOUND');
  }
  logAdminAudit(adminId, 'UPDATE_QUIZ', updated.id);
  return updated;
}
