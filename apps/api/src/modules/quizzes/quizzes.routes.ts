import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validateRequest } from '../../middleware/validate';
import {
  quizIdParamSchema,
  courseQuizParamSchema,
  submitQuizAttemptSchema
} from './quizzes.validators';
import {
  listCourseQuizzesHandler,
  getQuizByIdHandler,
  submitQuizAttemptHandler,
  listMyQuizAttemptsHandler
} from './quizzes.controller';

// Mounted at /api/v1/quizzes
export const quizzesRouter = Router();

quizzesRouter.get(
  '/:quizId',
  validateRequest({ params: quizIdParamSchema }),
  getQuizByIdHandler
);

quizzesRouter.post(
  '/:quizId/attempts',
  authenticate,
  validateRequest({ params: quizIdParamSchema, body: submitQuizAttemptSchema }),
  submitQuizAttemptHandler
);

// Backward-compatible alias documented in docs/api/quiz-endpoints.md
quizzesRouter.post(
  '/:quizId/submit',
  authenticate,
  validateRequest({ params: quizIdParamSchema, body: submitQuizAttemptSchema }),
  submitQuizAttemptHandler
);

// Mounted at /api/v1/me/quiz-attempts
export const myQuizAttemptsRouter = Router();
myQuizAttemptsRouter.use(authenticate);
myQuizAttemptsRouter.get('/', listMyQuizAttemptsHandler);

// Mounted at /api/v1/courses
export const courseQuizzesRouter = Router();
courseQuizzesRouter.get(
  '/:courseId/quizzes',
  validateRequest({ params: courseQuizParamSchema }),
  listCourseQuizzesHandler
);

export default quizzesRouter;
