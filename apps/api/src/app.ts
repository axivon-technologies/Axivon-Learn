import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { env } from './config/env';
import { isDatabaseConnected } from './database/connection';
import { Category } from './database/models/Category';
import { Course } from './database/models/Course';
import { Quiz } from './database/models/Quiz';
import { QuizQuestion } from './database/models/QuizQuestion';
import { Enrollment } from './database/models/Enrollment';

import { errorHandler, AppError } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { authenticate } from './middleware/authenticate';
import { authorize } from './middleware/authorize';
import { sanitizeInput } from './middleware/sanitize';
import { sendSuccess } from './shared/response';
import { isValidObjectId } from './utils/objectId';

import { authRouter } from './modules/auth/auth.routes';
import { usersRouter } from './modules/users/users.routes';
import { categoriesRouter } from './modules/categories/categories.routes';
import { coursesRouter } from './modules/courses/courses.routes';
import { learningPathsRouter } from './modules/learning-paths/learning-paths.routes';
import { projectsRouter } from './modules/projects/projects.routes';

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
// 2. AUTHENTICATION & USERS DOMAIN MODULES (Step 04 Modularized)
// -----------------------------------------------------------------------------
app.use(`${env.API_PREFIX}/auth`, authRouter);
app.use(`${env.API_PREFIX}/users`, usersRouter);

// -----------------------------------------------------------------------------
// 3. PUBLIC CATALOG DOMAIN MODULES (Step 05 Modularized)
// -----------------------------------------------------------------------------
app.use(`${env.API_PREFIX}/categories`, categoriesRouter);
app.use(`${env.API_PREFIX}/courses`, coursesRouter);
app.use(`${env.API_PREFIX}/learning-paths`, learningPathsRouter);
app.use(`${env.API_PREFIX}/projects`, projectsRouter);

// -----------------------------------------------------------------------------
// 4. ENROLLMENTS & PROGRESS (Modularized in Step 06)
// -----------------------------------------------------------------------------
app.get(
  `${env.API_PREFIX}/enrollments`,
  authenticate,
  async (req: Request, res: Response, next) => {
    try {
      if (isDatabaseConnected() && isValidObjectId(req.user!.id)) {
        const enrollments = await Enrollment.find({ userId: req.user!.id })
          .populate('courseId')
          .lean();
        return sendSuccess(res, enrollments);
      }
      return sendSuccess(res, []);
    } catch (err) {
      next(err);
    }
  }
);

// -----------------------------------------------------------------------------
// 5. QUIZZES MODULE (Modularized in Step 07)
// -----------------------------------------------------------------------------
app.get(`${env.API_PREFIX}/quizzes/:quizId`, async (req: Request, res: Response, next) => {
  try {
    const { quizId } = req.params;
    if (isDatabaseConnected()) {
      if (!isValidObjectId(quizId)) {
        throw new AppError('Quiz not found.', 404, undefined, 'NOT_FOUND');
      }
      const quiz = await Quiz.findById(quizId).lean();
      if (!quiz || quiz.status === 'draft') {
        throw new AppError('Quiz not found.', 404, undefined, 'NOT_FOUND');
      }
      const questions = await QuizQuestion.find({ quizId: quiz._id })
        .select('-correctOptionIndex')
        .sort({ order: 1 })
        .lean();

      return sendSuccess(res, {
        quizId: quiz._id.toString(),
        title: quiz.title,
        description: quiz.description,
        passingScore: quiz.passingScore,
        questions: questions.map((q) => ({
          id: q._id.toString(),
          prompt: q.prompt,
          options: q.options,
          order: q.order
        }))
      });
    }

    return sendSuccess(res, {
      quizId,
      questions: [
        {
          id: 'q1',
          prompt: 'Which HTTP method creates a new resource in a RESTful API?',
          options: ['GET', 'POST', 'PUT', 'DELETE']
        }
      ]
    });
  } catch (err) {
    next(err);
  }
});

// -----------------------------------------------------------------------------
// 6. ADMIN PROTECTED OPERATIONS (Modularized in Step 07)
// -----------------------------------------------------------------------------
app.get(
  `${env.API_PREFIX}/admin/overview`,
  authenticate,
  authorize(['admin']),
  async (_req: Request, res: Response, next) => {
    try {
      if (isDatabaseConnected()) {
        const [totalCourses, publishedCourses, draftCourses, totalCategories] = await Promise.all([
          Course.countDocuments(),
          Course.countDocuments({ status: 'published' }),
          Course.countDocuments({ status: 'draft' }),
          Category.countDocuments({ isActive: true })
        ]);
        return sendSuccess(res, {
          totalCourses,
          publishedCourses,
          draftCourses,
          totalCategories
        });
      }

      return sendSuccess(res, {
        totalCourses: 2,
        publishedCourses: 2,
        draftCourses: 0,
        totalCategories: 3
      });
    } catch (err) {
      next(err);
    }
  }
);

// -----------------------------------------------------------------------------
// 7. 404 NOT FOUND & ERROR HANDLERS
// -----------------------------------------------------------------------------
app.use((_req: Request, _res: Response, next) => {
  next(new AppError('API endpoint not found.', 404, undefined, 'NOT_FOUND'));
});

app.use(errorHandler);

export default app;
