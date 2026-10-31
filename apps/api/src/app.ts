import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { env } from './config/env';
import { isDatabaseConnected } from './database/connection';
import { User } from './database/models/User';
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

export const app = express();

// Security and Parsers
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser(env.COOKIE_SECRET));
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
// 2. AUTHENTICATION MODULE
// -----------------------------------------------------------------------------
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

app.post(`${env.API_PREFIX}/auth/register`, validate(registerSchema), async (req: Request, res: Response, next) => {
  try {
    const { name, email, password } = req.body;

    if (isDatabaseConnected()) {
      const existing = await User.findOne({ email });
      if (existing) {
        throw new AppError('An account with this email address already exists.', 409);
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

      return res.status(201).json({
        success: true,
        data: {
          user: { id: user._id, name: user.name, email: user.email, role: user.role },
          token
        }
      });
    }

    // In-memory fallback if DB not connected during setup
    const token = jwt.sign({ id: 'mem-1', email, role: 'learner' }, env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('access_token', token, { httpOnly: true });
    return res.status(201).json({
      success: true,
      data: { user: { id: 'mem-1', name, email, role: 'learner' }, token }
    });
  } catch (err) {
    next(err);
  }
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

app.post(`${env.API_PREFIX}/auth/login`, validate(loginSchema), async (req: Request, res: Response, next) => {
  try {
    const { email, password } = req.body;

    if (isDatabaseConnected()) {
      const user = await User.findOne({ email }).select('+passwordHash');
      if (!user) {
        throw new AppError('Invalid credentials.', 401);
      }

      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) {
        throw new AppError('Invalid credentials.', 401);
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

      return res.status(200).json({
        success: true,
        data: {
          user: { id: user._id, name: user.name, email: user.email, role: user.role },
          token
        }
      });
    }

    // Baseline offline check
    if (email === 'admin@axivon.local' || email === 'learner@axivon.local') {
      const role = email.includes('admin') ? 'admin' : 'learner';
      const token = jwt.sign({ id: 'demo-1', email, role }, env.JWT_SECRET, { expiresIn: '1d' });
      res.cookie('access_token', token, { httpOnly: true });
      return res.status(200).json({
        success: true,
        data: { user: { id: 'demo-1', name: 'Demo User', email, role }, token }
      });
    }

    throw new AppError('Invalid email or password.', 401);
  } catch (err) {
    next(err);
  }
});

app.post(`${env.API_PREFIX}/auth/logout`, (_req: Request, res: Response) => {
  res.clearCookie('access_token');
  res.status(200).json({ success: true, message: 'Signed out successfully.' });
});

app.get(`${env.API_PREFIX}/auth/me`, authenticate, (req: Request, res: Response) => {
  res.status(200).json({ success: true, data: { user: req.user } });
});

// -----------------------------------------------------------------------------
// 3. COURSES MODULE (Public Discovery)
// -----------------------------------------------------------------------------
app.get(`${env.API_PREFIX}/courses`, async (req: Request, res: Response, next) => {
  try {
    const { category } = req.query;
    if (isDatabaseConnected()) {
      const filter: any = { status: 'published' };
      if (category && category !== 'all') {
        filter.category = new RegExp(String(category), 'i');
      }
      const courses = await Course.find(filter).lean();
      return res.status(200).json({ success: true, data: courses });
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
    ];

    res.status(200).json({ success: true, data: fallbackCourses });
  } catch (err) {
    next(err);
  }
});

app.get(`${env.API_PREFIX}/courses/:slug`, async (req: Request, res: Response, next) => {
  try {
    const { slug } = req.params;
    if (isDatabaseConnected()) {
      const course = await Course.findOne({ slug, status: 'published' }).lean();
      if (!course) throw new AppError('Course not found.', 404);

      const modules = await CourseModule.find({ courseId: course._id }).sort({ order: 1 }).lean();
      const populatedModules = await Promise.all(
        modules.map(async (mod) => {
          const lessons = await Lesson.find({ moduleId: mod._id }).sort({ order: 1 }).lean();
          return { ...mod, lessons };
        })
      );

      return res.status(200).json({ success: true, data: { ...course, modules: populatedModules } });
    }

    if (slug === 'ai-ml-foundations' || slug === 'full-stack-web-development') {
      const isAI = slug === 'ai-ml-foundations';
      return res.status(200).json({
        success: true,
        data: {
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
        }
      });
    }

    throw new AppError('Course not found.', 404);
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
      return res.status(200).json({ success: true, data: paths });
    }

    res.status(200).json({
      success: true,
      data: [
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
      ]
    });
  } catch (err) {
    next(err);
  }
});

// -----------------------------------------------------------------------------
// 5. ENROLLMENTS & PROGRESS
// -----------------------------------------------------------------------------
app.get(`${env.API_PREFIX}/enrollments`, authenticate, async (req: Request, res: Response, next) => {
  try {
    if (isDatabaseConnected()) {
      const enrollments = await Enrollment.find({ userId: req.user!.id }).populate('courseId').lean();
      return res.status(200).json({ success: true, data: enrollments });
    }
    res.status(200).json({ success: true, data: [] });
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
      const questions = await QuizQuestion.find({ quizId }).select('-correctOptionIndex').lean();
      return res.status(200).json({ success: true, data: { quizId, questions } });
    }

    res.status(200).json({
      success: true,
      data: {
        quizId,
        questions: [
          {
            id: 'q1',
            prompt: 'Which HTTP method creates a new resource in a RESTful API?',
            options: ['GET', 'POST', 'PUT', 'DELETE']
          }
        ]
      }
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
      const totalCourses = await Course.countDocuments();
      const publishedCourses = await Course.countDocuments({ status: 'published' });
      const draftCourses = await Course.countDocuments({ status: 'draft' });
      return res.status(200).json({
        success: true,
        data: { totalCourses, publishedCourses, draftCourses, totalCategories: 3 }
      });
    }

    res.status(200).json({
      success: true,
      data: { totalCourses: 2, publishedCourses: 2, draftCourses: 0, totalCategories: 3 }
    });
  } catch (err) {
    next(err);
  }
});

// -----------------------------------------------------------------------------
// 8. 404 NOT FOUND & ERROR HANDLERS
// -----------------------------------------------------------------------------
app.use((_req: Request, _res: Response, next) => {
  next(new AppError('API endpoint not found.', 404));
});

app.use(errorHandler);

export default app;
