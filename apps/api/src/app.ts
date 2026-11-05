import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { env } from './config/env';
import { isDatabaseConnected } from './database/connection';
import { User } from './database/models/User';
import { Category } from './database/models/Category';
import { Course } from './database/models/Course';
import { CourseModule } from './database/models/CourseModule';
import { Lesson } from './database/models/Lesson';
import { LearningPath } from './database/models/LearningPath';
import { Quiz } from './database/models/Quiz';
import { QuizQuestion } from './database/models/QuizQuestion';
import { Enrollment } from './database/models/Enrollment';

import { errorHandler, AppError } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { authenticate } from './middleware/authenticate';
import { authorize } from './middleware/authorize';
import { validate } from './middleware/validate';
import { sanitizeInput } from './middleware/sanitize';
import { authRateLimiter } from './middleware/rateLimit';
import { sendSuccess } from './shared/response';
import { escapeRegex } from './utils/regex';
import { isValidObjectId } from './utils/objectId';

export const app = express();

// Security and Parsers
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true
}));
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
// 2. AUTHENTICATION MODULE (Hardened Foundation; full modularization in Step 04)
// -----------------------------------------------------------------------------
const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Invalid email address').transform((v) => v.toLowerCase()),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

app.post(
  `${env.API_PREFIX}/auth/register`,
  authRateLimiter,
  validate(registerSchema),
  async (req: Request, res: Response, next) => {
    try {
      const { name, email, password } = req.body;

      if (isDatabaseConnected()) {
        const existing = await User.findOne({ email });
        if (existing) {
          throw new AppError('An account with this email address already exists.', 409, undefined, 'CONFLICT');
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await User.create({
          name,
          email,
          passwordHash,
          role: 'learner'
        });

        const token = jwt.sign(
          { id: user._id.toString(), email: user.email, role: user.role },
          env.JWT_SECRET,
          { expiresIn: env.JWT_EXPIRES_IN as any }
        );

        res.cookie('access_token', token, {
          httpOnly: true,
          secure: env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60 * 1000
        });

        return sendSuccess(
          res,
          {
            user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
            token
          },
          201
        );
      }

      // In-memory fallback if DB not connected during setup/CI
      const token = jwt.sign({ id: 'mem-1', email, role: 'learner' }, env.JWT_SECRET, { expiresIn: '1d' });
      res.cookie('access_token', token, { httpOnly: true });
      return sendSuccess(res, { user: { id: 'mem-1', name, email, role: 'learner' }, token }, 201);
    } catch (err) {
      next(err);
    }
  }
);

const loginSchema = z.object({
  email: z.string().trim().email('Invalid email format').transform((v) => v.toLowerCase()),
  password: z.string().min(1, 'Password is required')
});

app.post(
  `${env.API_PREFIX}/auth/login`,
  authRateLimiter,
  validate(loginSchema),
  async (req: Request, res: Response, next) => {
    try {
      const { email, password } = req.body;

      if (isDatabaseConnected()) {
        const user = await User.findOne({ email }).select('+passwordHash');
        if (!user || !user.isActive) {
          throw new AppError('Invalid credentials.', 401, undefined, 'UNAUTHORIZED');
        }

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) {
          throw new AppError('Invalid credentials.', 401, undefined, 'UNAUTHORIZED');
        }

        const token = jwt.sign(
          { id: user._id.toString(), email: user.email, role: user.role },
          env.JWT_SECRET,
          { expiresIn: env.JWT_EXPIRES_IN as any }
        );

        res.cookie('access_token', token, {
          httpOnly: true,
          secure: env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60 * 1000
        });

        return sendSuccess(res, {
          user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
          token
        });
      }

      // Baseline offline check
      if (email === 'admin@axivon.local' || email === 'learner@axivon.local') {
        const role = email.includes('admin') ? 'admin' : 'learner';
        const token = jwt.sign({ id: 'demo-1', email, role }, env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('access_token', token, { httpOnly: true });
        return sendSuccess(res, { user: { id: 'demo-1', name: 'Demo User', email, role }, token });
      }

      throw new AppError('Invalid email or password.', 401, undefined, 'UNAUTHORIZED');
    } catch (err) {
      next(err);
    }
  }
);

app.post(`${env.API_PREFIX}/auth/logout`, (_req: Request, res: Response) => {
  res.clearCookie('access_token');
  res.status(200).json({ success: true, data: { message: 'Signed out successfully.' }, error: null, message: 'Signed out successfully.' });
});

app.get(`${env.API_PREFIX}/auth/me`, authenticate, async (req: Request, res: Response, next) => {
  try {
    if (isDatabaseConnected() && req.user?.id && isValidObjectId(req.user.id)) {
      const dbUser = await User.findById(req.user.id).lean();
      if (!dbUser || !dbUser.isActive) {
        throw new AppError('Account not found or inactive.', 401, undefined, 'UNAUTHORIZED');
      }
      return sendSuccess(res, {
        user: {
          id: dbUser._id.toString(),
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role,
          createdAt: dbUser.createdAt
        }
      });
    }
    return sendSuccess(res, { user: req.user });
  } catch (err) {
    next(err);
  }
});

// -----------------------------------------------------------------------------
// 3. COURSES MODULE (Public Discovery)
// -----------------------------------------------------------------------------
app.get(`${env.API_PREFIX}/courses`, async (req: Request, res: Response, next) => {
  try {
    const rawCategory = typeof req.query.category === 'string' ? req.query.category.trim() : '';

    if (isDatabaseConnected()) {
      const filter: Record<string, unknown> = { status: 'published' };
      if (rawCategory && rawCategory.toLowerCase() !== 'all') {
        filter.category = new RegExp(`^${escapeRegex(rawCategory)}$`, 'i');
      }

      const courses = await Course.find(filter).sort({ createdAt: -1 }).lean();
      const enriched = await Promise.all(
        courses.map(async (c) => {
          const [moduleCount, lessonCount] = await Promise.all([
            CourseModule.countDocuments({ courseId: c._id }),
            Lesson.countDocuments({ courseId: c._id })
          ]);
          return {
            ...c,
            id: c._id.toString(),
            moduleCount,
            lessonCount
          };
        })
      );

      return sendSuccess(res, enriched);
    }

    // Default baseline courses aligned with blueprint
    const fallbackCourses = [
      {
        id: 'c1',
        title: 'AI & Machine Learning Foundations',
        slug: 'ai-ml-foundations',
        summary: 'Master foundational Python, NumPy, Pandas, regression models, and neural network basics.',
        category: 'AI & Machine Learning',
        level: 'beginner',
        status: 'published',
        moduleCount: 3,
        lessonCount: 12,
        estimatedDurationHours: 6
      },
      {
        id: 'c2',
        title: 'Full Stack Web Development',
        slug: 'full-stack-web-development',
        summary: 'Build end-to-end web applications with React, TypeScript, Node.js, Express, and MongoDB.',
        category: 'Web Development',
        level: 'beginner',
        status: 'published',
        moduleCount: 4,
        lessonCount: 16,
        estimatedDurationHours: 8
      }
    ].filter((c) => !rawCategory || rawCategory.toLowerCase() === 'all' || c.category.toLowerCase() === rawCategory.toLowerCase());

    return sendSuccess(res, fallbackCourses);
  } catch (err) {
    next(err);
  }
});

app.get(`${env.API_PREFIX}/courses/:slug`, async (req: Request, res: Response, next) => {
  try {
    const slug = String(req.params.slug || '').trim().toLowerCase();
    if (isDatabaseConnected()) {
      const course = await Course.findOne({ slug, status: 'published' }).lean();
      if (!course) throw new AppError('Course not found.', 404, undefined, 'NOT_FOUND');

      const modules = await CourseModule.find({ courseId: course._id }).sort({ order: 1 }).lean();
      const populatedModules = await Promise.all(
        modules.map(async (mod) => {
          const lessons = await Lesson.find({ moduleId: mod._id }).sort({ order: 1 }).lean();
          return {
            ...mod,
            id: mod._id.toString(),
            lessons: lessons.map((l) => ({ ...l, id: l._id.toString() }))
          };
        })
      );

      return sendSuccess(res, {
        ...course,
        id: course._id.toString(),
        modules: populatedModules
      });
    }

    if (slug === 'ai-ml-foundations' || slug === 'full-stack-web-development') {
      const isAI = slug === 'ai-ml-foundations';
      return sendSuccess(res, {
        id: isAI ? 'c1' : 'c2',
        title: isAI ? 'AI & Machine Learning Foundations' : 'Full Stack Web Development',
        slug,
        summary: isAI ? 'Master Python, NumPy, Pandas, regression models, and neural networks.' : 'Build modern web apps with React, Express, and MongoDB.',
        category: isAI ? 'AI & Machine Learning' : 'Web Development',
        level: 'beginner',
        estimatedDurationHours: isAI ? 6 : 8,
        outcomes: ['Understand architectural principles', 'Write clean modular code', 'Validate and persist state'],
        prerequisites: ['Basic programming syntax'],
        modules: [
          {
            id: 'm1',
            title: isAI ? 'Module 1: Machine Learning Foundations' : 'Module 1: Web Architecture & REST APIs',
            lessons: [
              { id: 'l1', title: '1.1 System Architecture', slug: 'system-architecture', isFreePreview: true },
              { id: 'l2', title: '1.2 Core Data Handling', slug: 'data-handling', isFreePreview: false }
            ]
          }
        ]
      });
    }

    throw new AppError('Course not found.', 404, undefined, 'NOT_FOUND');
  } catch (err) {
    next(err);
  }
});

// -----------------------------------------------------------------------------
// 4. LEARNING PATHS MODULE
// -----------------------------------------------------------------------------
app.get(`${env.API_PREFIX}/learning-paths`, async (_req: Request, res: Response, next) => {
  try {
    if (isDatabaseConnected()) {
      const paths = await LearningPath.find({ status: 'published' }).lean();
      return sendSuccess(
        res,
        paths.map((p) => ({ ...p, id: p._id.toString() }))
      );
    }

    return sendSuccess(res, [
      {
        id: 'p1',
        title: 'AI & Machine Learning Foundations',
        slug: 'ai-ml-path',
        description: 'A structured sequence from Python fundamentals to neural networks.',
        estimatedHours: 40,
        level: 'Beginner to Intermediate'
      },
      {
        id: 'p2',
        title: 'Full Stack Web Development',
        slug: 'full-stack-path',
        description: 'Master full-stack engineering using modern TypeScript, React, and Express.',
        estimatedHours: 50,
        level: 'Beginner to Advanced'
      }
    ]);
  } catch (err) {
    next(err);
  }
});

// -----------------------------------------------------------------------------
// 5. ENROLLMENTS & PROGRESS
// -----------------------------------------------------------------------------
app.get(`${env.API_PREFIX}/enrollments`, authenticate, async (req: Request, res: Response, next) => {
  try {
    if (isDatabaseConnected() && isValidObjectId(req.user!.id)) {
      const enrollments = await Enrollment.find({ userId: req.user!.id }).populate('courseId').lean();
      return sendSuccess(res, enrollments);
    }
    return sendSuccess(res, []);
  } catch (err) {
    next(err);
  }
});

// -----------------------------------------------------------------------------
// 6. QUIZZES MODULE
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
// 7. ADMIN PROTECTED OPERATIONS
// -----------------------------------------------------------------------------
app.get(`${env.API_PREFIX}/admin/overview`, authenticate, authorize(['admin']), async (_req: Request, res: Response, next) => {
  try {
    if (isDatabaseConnected()) {
      const [totalCourses, publishedCourses, draftCourses, totalCategories] = await Promise.all([
        Course.countDocuments(),
        Course.countDocuments({ status: 'published' }),
        Course.countDocuments({ status: 'draft' }),
        Category.countDocuments({ isActive: true })
      ]);
      return sendSuccess(res, { totalCourses, publishedCourses, draftCourses, totalCategories });
    }

    return sendSuccess(res, { totalCourses: 2, publishedCourses: 2, draftCourses: 0, totalCategories: 3 });
  } catch (err) {
    next(err);
  }
});

// -----------------------------------------------------------------------------
// 8. 404 NOT FOUND & ERROR HANDLERS
// -----------------------------------------------------------------------------
app.use((_req: Request, _res: Response, next) => {
  next(new AppError('API endpoint not found.', 404, undefined, 'NOT_FOUND'));
});

app.use(errorHandler);

export default app;
