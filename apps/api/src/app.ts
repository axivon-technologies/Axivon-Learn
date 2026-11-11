import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { env } from './config/env';
import { isDatabaseConnected } from './database/connection';

import { errorHandler, AppError } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { sanitizeInput } from './middleware/sanitize';

import { authRouter } from './modules/auth/auth.routes';
import { usersRouter } from './modules/users/users.routes';
import { categoriesRouter } from './modules/categories/categories.routes';
import { coursesRouter } from './modules/courses/courses.routes';
import { learningPathsRouter } from './modules/learning-paths/learning-paths.routes';
import { projectsRouter } from './modules/projects/projects.routes';
import {
  enrollmentsRouter,
  courseEnrollmentsRouter
} from './modules/enrollments/enrollments.routes';
import { courseModulesRouter } from './modules/modules/modules.routes';
import { lessonsRouter, courseLessonsRouter } from './modules/lessons/lessons.routes';
import {
  lessonProgressRouter,
  myProgressRouter,
  userProgressRouter
} from './modules/progress/progress.routes';
import {
  quizzesRouter,
  myQuizAttemptsRouter,
  courseQuizzesRouter
} from './modules/quizzes/quizzes.routes';
import { adminRouter } from './modules/admin/admin.routes';

export const app = express();

// Security and Parsers
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true
  })
);
app.use(express.json({ limit: '256kb' }));
app.use(cookieParser(env.COOKIE_SECRET));
app.use(sanitizeInput);
app.use(requestLogger);

// -----------------------------------------------------------------------------
// 1. SYSTEM HEALTH CHECK ENDPOINT
// -----------------------------------------------------------------------------
app.get(`${env.API_PREFIX}/health`, (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    database: isDatabaseConnected() ? 'connected' : 'disconnected'
  });
});

// -----------------------------------------------------------------------------
// 2. AUTHENTICATION & USERS DOMAIN MODULES
// -----------------------------------------------------------------------------
app.use(`${env.API_PREFIX}/auth`, authRouter);
app.use(`${env.API_PREFIX}/users`, userProgressRouter);
app.use(`${env.API_PREFIX}/users`, usersRouter);

// -----------------------------------------------------------------------------
// 3. PUBLIC CATALOG & COURSE SUB-RESOURCE MODULES
// -----------------------------------------------------------------------------
app.use(`${env.API_PREFIX}/categories`, categoriesRouter);
app.use(`${env.API_PREFIX}/courses`, courseEnrollmentsRouter);
app.use(`${env.API_PREFIX}/courses`, courseModulesRouter);
app.use(`${env.API_PREFIX}/courses`, courseLessonsRouter);
app.use(`${env.API_PREFIX}/courses`, courseQuizzesRouter);
app.use(`${env.API_PREFIX}/courses`, coursesRouter);
app.use(`${env.API_PREFIX}/learning-paths`, learningPathsRouter);
app.use(`${env.API_PREFIX}/projects`, projectsRouter);

// -----------------------------------------------------------------------------
// 4. LEARNER ENROLLMENTS, LESSONS & PROGRESS MODULES
// -----------------------------------------------------------------------------
app.use(`${env.API_PREFIX}/enrollments`, enrollmentsRouter);
app.use(`${env.API_PREFIX}/me/enrollments`, enrollmentsRouter);
app.use(`${env.API_PREFIX}/me/progress`, myProgressRouter);
app.use(`${env.API_PREFIX}/me/quiz-attempts`, myQuizAttemptsRouter);
app.use(`${env.API_PREFIX}/lessons`, lessonProgressRouter);
app.use(`${env.API_PREFIX}/lessons`, lessonsRouter);

// -----------------------------------------------------------------------------
// 5. QUIZZES & ASSESSMENTS MODULE
// -----------------------------------------------------------------------------
app.use(`${env.API_PREFIX}/quizzes`, quizzesRouter);

// -----------------------------------------------------------------------------
// 6. ADMIN CMS & METRICS MODULE (Strict Admin RBAC)
// -----------------------------------------------------------------------------
app.use(`${env.API_PREFIX}/admin`, adminRouter);

// -----------------------------------------------------------------------------
// 7. 404 NOT FOUND & CENTRALIZED ERROR HANDLERS
// -----------------------------------------------------------------------------
app.use((_req: Request, _res: Response, next) => {
  next(new AppError('API endpoint not found.', 404, undefined, 'NOT_FOUND'));
});

app.use(errorHandler);

export default app;
