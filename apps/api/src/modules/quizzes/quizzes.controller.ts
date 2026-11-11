import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/response';
import {
  getCourseQuizzesList,
  getQuizPayloadForLearner,
  submitQuizAttemptAndScore,
  getLearnerOwnQuizAttempts
} from './quizzes.service';

export async function listCourseQuizzesHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const quizzes = await getCourseQuizzesList(String(req.params.courseId));
    sendSuccess(res, quizzes, 200);
  } catch (err) {
    next(err);
  }
}

export async function getQuizByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const quiz = await getQuizPayloadForLearner(String(req.params.quizId));
    sendSuccess(res, quiz, 200);
  } catch (err) {
    next(err);
  }
}

export async function submitQuizAttemptHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await submitQuizAttemptAndScore(
      req.user!,
      String(req.params.quizId),
      req.body
    );
    const statusCode = req.path.endsWith('/submit') ? 200 : 201;
    sendSuccess(res, result, statusCode);
  } catch (err) {
    next(err);
  }
}

export async function listMyQuizAttemptsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const attempts = await getLearnerOwnQuizAttempts(req.user!.id);
    sendSuccess(res, attempts, 200);
  } catch (err) {
    next(err);
  }
}
