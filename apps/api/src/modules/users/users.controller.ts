import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/response';
import {
  getOwnUserProfile,
  updateOwnUserProfile,
  changeOwnUserPassword,
  getUserProfileById
} from './users.service';

export async function getMyProfileHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await getOwnUserProfile(req.user!.id);
    sendSuccess(res, { user }, 200);
  } catch (err) {
    next(err);
  }
}

export async function updateMyProfileHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await updateOwnUserProfile(req.user!.id, req.body);
    sendSuccess(res, { user }, 200);
  } catch (err) {
    next(err);
  }
}

export async function changeMyPasswordHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await changeOwnUserPassword(req.user!.id, req.body);
    sendSuccess(res, result, 200);
  } catch (err) {
    next(err);
  }
}

export async function getUserByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await getUserProfileById(req.user!, String(req.params.userId));
    sendSuccess(res, { user }, 200);
  } catch (err) {
    next(err);
  }
}
