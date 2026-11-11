import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/response';
import {
  getAdminPlatformMetrics,
  listCategoriesForAdmin,
  createCategoryAsAdmin,
  updateCategoryAsAdmin,
  listCoursesForAdmin,
  getCourseDetailForAdmin,
  createCourseAsAdmin,
  updateCourseAsAdmin,
  createModuleAsAdmin,
  updateModuleAsAdmin,
  createLessonAsAdmin,
  updateLessonAsAdmin,
  listQuizzesForAdmin,
  createQuizAsAdmin,
  updateQuizAsAdmin
} from './admin.service';

export async function getAdminMetricsHandler(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const metrics = await getAdminPlatformMetrics();
    sendSuccess(res, metrics, 200);
  } catch (err) {
    next(err);
  }
}

export async function adminListCategoriesHandler(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const categories = await listCategoriesForAdmin();
    sendSuccess(res, categories, 200);
  } catch (err) {
    next(err);
  }
}

export async function adminCreateCategoryHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const created = await createCategoryAsAdmin(req.user!.id, req.body);
    sendSuccess(res, created, 201);
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateCategoryHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const updated = await updateCategoryAsAdmin(req.user!.id, String(req.params.id), req.body);
    sendSuccess(res, updated, 200);
  } catch (err) {
    next(err);
  }
}

export async function adminListCoursesHandler(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const courses = await listCoursesForAdmin();
    sendSuccess(res, courses, 200);
  } catch (err) {
    next(err);
  }
}

export async function adminGetCourseByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const course = await getCourseDetailForAdmin(String(req.params.id));
    sendSuccess(res, course, 200);
  } catch (err) {
    next(err);
  }
}

export async function adminCreateCourseHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const created = await createCourseAsAdmin(req.user!.id, req.body);
    sendSuccess(res, created, 201);
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateCourseHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const updated = await updateCourseAsAdmin(req.user!.id, String(req.params.id), req.body);
    sendSuccess(res, updated, 200);
  } catch (err) {
    next(err);
  }
}

export async function adminCreateModuleHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const created = await createModuleAsAdmin(req.user!.id, String(req.params.id), req.body);
    sendSuccess(res, created, 201);
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateModuleHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const updated = await updateModuleAsAdmin(req.user!.id, String(req.params.id), req.body);
    sendSuccess(res, updated, 200);
  } catch (err) {
    next(err);
  }
}

export async function adminCreateLessonHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const created = await createLessonAsAdmin(req.user!.id, String(req.params.id), req.body);
    sendSuccess(res, created, 201);
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateLessonHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const updated = await updateLessonAsAdmin(req.user!.id, String(req.params.id), req.body);
    sendSuccess(res, updated, 200);
  } catch (err) {
    next(err);
  }
}

export async function adminListQuizzesHandler(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const quizzes = await listQuizzesForAdmin();
    sendSuccess(res, quizzes, 200);
  } catch (err) {
    next(err);
  }
}

export async function adminCreateQuizHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const created = await createQuizAsAdmin(req.user!.id, req.body);
    sendSuccess(res, created, 201);
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateQuizHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const updated = await updateQuizAsAdmin(req.user!.id, String(req.params.id), req.body);
    sendSuccess(res, updated, 200);
  } catch (err) {
    next(err);
  }
}
