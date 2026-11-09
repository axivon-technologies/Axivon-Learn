import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/response';
import { listCourseModulesOutline } from './modules.service';

export async function listCourseModulesHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const modules = await listCourseModulesOutline(String(req.params.courseId));
    sendSuccess(res, modules, 200);
  } catch (err) {
    next(err);
  }
}
