import mongoose from 'mongoose';
import { isDatabaseConnected } from '../../database/connection';
import { Quiz } from '../../database/models/Quiz';
import { QuizQuestion } from '../../database/models/QuizQuestion';
import { QuizAttempt } from '../../database/models/QuizAttempt';
import { isValidObjectId } from '../../utils/objectId';
import {
  MEMORY_CATALOG_IDS,
  findPublishedCourseSummaryById,
  findAnyCourseSummaryById
} from '../courses/catalog.store';

export interface StoredQuizRecord {
  id: string;
  courseId: string;
  moduleId: string | null;
  lessonId: string | null;
  title: string;
  description: string;
  passingScore: number;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

export interface StoredQuestionRecord {
  id: string;
  quizId: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  order: number;
}

export interface StoredQuizAttemptRecord {
  id: string;
  userId: string;
  quizId: string;
  answers: Record<string, number>;
  score: number;
  totalQuestions: number;
  passed: boolean;
  attemptedAt: Date;
}

export const MEMORY_QUIZ_IDS = {
  quizWeb: '607f1f77bcf86cd799439061',
  quizAI: '607f1f77bcf86cd799439062',
  quizDraft: '607f1f77bcf86cd799439063',
  qWeb1: '607f1f77bcf86cd799439071',
  qWeb2: '607f1f77bcf86cd799439072',
  qWeb3: '607f1f77bcf86cd799439073',
  qAI1: '607f1f77bcf86cd799439074',
  qAI2: '607f1f77bcf86cd799439075',
  qAI3: '607f1f77bcf86cd799439076',
  qDraft1: '607f1f77bcf86cd799439077'
} as const;

let memoryQuizzes: StoredQuizRecord[] = [];
let memoryQuestions: StoredQuestionRecord[] = [];
let memoryAttempts: StoredQuizAttemptRecord[] = [];

function ensureDefaultMemoryQuizzes(): void {
  if (memoryQuizzes.length > 0) return;

  const t1 = new Date('2026-10-22T10:00:00.000Z');
  const t2 = new Date('2026-10-26T10:00:00.000Z');

  memoryQuizzes = [
    {
      id: MEMORY_QUIZ_IDS.quizWeb,
      courseId: MEMORY_CATALOG_IDS.courseWeb,
      moduleId: MEMORY_CATALOG_IDS.modWeb1,
      lessonId: MEMORY_CATALOG_IDS.lessonWeb1,
      title: 'Module 1 Assessment: REST & Web Fundamentals',
      description: 'Verify your understanding of RESTful HTTP semantics, shared types, and backend RBAC.',
      passingScore: 2,
      status: 'published',
      createdAt: t2,
      updatedAt: t2
    },
    {
      id: MEMORY_QUIZ_IDS.quizAI,
      courseId: MEMORY_CATALOG_IDS.courseAI,
      moduleId: MEMORY_CATALOG_IDS.modAI1,
      lessonId: MEMORY_CATALOG_IDS.lessonAI1,
      title: 'Module 1 Assessment: Machine Learning Foundations',
      description: 'Check your grasp of supervised vs. unsupervised learning and evaluation metrics.',
      passingScore: 2,
      status: 'published',
      createdAt: t1,
      updatedAt: t1
    },
    {
      id: MEMORY_QUIZ_IDS.quizDraft,
      courseId: MEMORY_CATALOG_IDS.courseAI,
      moduleId: MEMORY_CATALOG_IDS.modAI2,
      lessonId: null,
      title: 'Internal Draft Quiz: Deep Neural Networks',
      description: 'Unpublished quiz still being authored by curriculum team.',
      passingScore: 1,
      status: 'draft',
      createdAt: t2,
      updatedAt: t2
    }
  ];

  memoryQuestions = [
    {
      id: MEMORY_QUIZ_IDS.qWeb1,
      quizId: MEMORY_QUIZ_IDS.quizWeb,
      prompt: 'Which HTTP method is typically used to create a new resource in a RESTful API?',
      options: ['GET', 'POST', 'PUT', 'DELETE'],
      correctOptionIndex: 1,
      explanation: 'POST creates a new subordinate resource on the server.',
      order: 1
    },
    {
      id: MEMORY_QUIZ_IDS.qWeb2,
      quizId: MEMORY_QUIZ_IDS.quizWeb,
      prompt: 'In a modular monorepo architecture, what is the primary role of shared-types packages?',
      options: [
        'To store binary media files',
        'To provide a single source of truth for cross-stack TypeScript interfaces',
        'To run backend database migrations',
        'To serve static HTML pages'
      ],
      correctOptionIndex: 1,
      explanation: 'Shared TypeScript interfaces keep frontend and backend contracts aligned.',
      order: 2
    },
    {
      id: MEMORY_QUIZ_IDS.qWeb3,
      quizId: MEMORY_QUIZ_IDS.quizWeb,
      prompt: 'Where must role-based authorization be enforced to ensure true platform security?',
      options: [
        'Exclusively by hiding UI buttons on the frontend',
        'Inside CSS media queries',
        'On the backend API for every protected endpoint',
        'Only on public landing pages'
      ],
      correctOptionIndex: 2,
      explanation: 'Frontend UI checks can be bypassed; backend RBAC is mandatory.',
      order: 3
    },
    {
      id: MEMORY_QUIZ_IDS.qAI1,
      quizId: MEMORY_QUIZ_IDS.quizAI,
      prompt: 'Which learning paradigm trains models using labeled input-output pairs?',
      options: ['Unsupervised learning', 'Supervised learning', 'Reinforcement routing', 'Random search'],
      correctOptionIndex: 1,
      explanation: 'Supervised learning maps inputs to known target labels.',
      order: 1
    },
    {
      id: MEMORY_QUIZ_IDS.qAI2,
      quizId: MEMORY_QUIZ_IDS.quizAI,
      prompt: 'Why do we split a dataset into separate training and test sets?',
      options: [
        'To reduce disk usage',
        'To evaluate generalization on unseen data and detect overfitting',
        'To skip feature normalization',
        'To increase training loss'
      ],
      correctOptionIndex: 1,
      explanation: 'Held-out test sets measure how well a model generalizes to new examples.',
      order: 2
    },
    {
      id: MEMORY_QUIZ_IDS.qAI3,
      quizId: MEMORY_QUIZ_IDS.quizAI,
      prompt: 'Which metric is commonly minimized when fitting a linear regression model?',
      options: ['Mean Squared Error (MSE)', 'HTTP Latency', 'DOM Depth', 'Frame Rate'],
      correctOptionIndex: 0,
      explanation: 'MSE penalizes squared residuals between predicted and actual continuous values.',
      order: 3
    },
    {
      id: MEMORY_QUIZ_IDS.qDraft1,
      quizId: MEMORY_QUIZ_IDS.quizDraft,
      prompt: 'Draft question not yet published',
      options: ['Option A', 'Option B'],
      correctOptionIndex: 0,
      explanation: 'Draft explanation',
      order: 1
    }
  ];
}

export function resetMemoryQuizzes(): void {
  memoryQuizzes = [];
  memoryQuestions = [];
  memoryAttempts = [];
  ensureDefaultMemoryQuizzes();
}

// -----------------------------------------------------------------------------
// Public / Learner Quiz Queries (NEVER return correctOptionIndex!)
// -----------------------------------------------------------------------------
export async function listPublishedQuizzesForCourse(courseId: string) {
  const course = await findPublishedCourseSummaryById(courseId);
  if (!course) return null;

  if (isDatabaseConnected()) {
    const quizzes = await Quiz.find({ courseId, status: 'published' }).sort({ createdAt: 1 }).lean();
    return Promise.all(
      quizzes.map(async (q) => {
        const questionCount = await QuizQuestion.countDocuments({ quizId: q._id });
        return {
          id: q._id.toString(),
          quizId: q._id.toString(),
          courseId: q.courseId.toString(),
          moduleId: q.moduleId ? q.moduleId.toString() : null,
          lessonId: q.lessonId ? q.lessonId.toString() : null,
          title: q.title,
          description: q.description || '',
          passingScore: q.passingScore,
          questionCount
        };
      })
    );
  }

  ensureDefaultMemoryQuizzes();
  return memoryQuizzes
    .filter((q) => q.courseId === courseId && q.status === 'published')
    .map((q) => ({
      id: q.id,
      quizId: q.id,
      courseId: q.courseId,
      moduleId: q.moduleId,
      lessonId: q.lessonId,
      title: q.title,
      description: q.description,
      passingScore: q.passingScore,
      questionCount: memoryQuestions.filter((qq) => qq.quizId === q.id).length
    }));
}

export async function findPublicQuizWithoutAnswerKey(quizId: string) {
  if (!isValidObjectId(quizId)) return null;

  if (isDatabaseConnected()) {
    const quiz = await Quiz.findById(quizId).lean();
    if (!quiz || quiz.status !== 'published') return null;

    const course = await findPublishedCourseSummaryById(quiz.courseId.toString());
    if (!course) return null;

    const questions = await QuizQuestion.find({ quizId: quiz._id })
      .select('-correctOptionIndex')
      .sort({ order: 1 })
      .lean();

    return {
      id: quiz._id.toString(),
      quizId: quiz._id.toString(),
      courseId: quiz.courseId.toString(),
      moduleId: quiz.moduleId ? quiz.moduleId.toString() : null,
      lessonId: quiz.lessonId ? quiz.lessonId.toString() : null,
      title: quiz.title,
      description: quiz.description || '',
      passingScore: quiz.passingScore,
      totalQuestions: questions.length,
      questions: questions.map((q) => ({
        id: q._id.toString(),
        prompt: q.prompt,
        options: q.options,
        order: q.order
      }))
    };
  }

  ensureDefaultMemoryQuizzes();
  const quiz = memoryQuizzes.find((q) => q.id === quizId && q.status === 'published');
  if (!quiz) return null;

  const course = await findPublishedCourseSummaryById(quiz.courseId);
  if (!course) return null;

  const questions = memoryQuestions
    .filter((q) => q.quizId === quiz.id)
    .sort((a, b) => a.order - b.order)
    .map((q) => ({
      id: q.id,
      prompt: q.prompt,
      options: [...q.options],
      order: q.order
    }));

  return {
    id: quiz.id,
    quizId: quiz.id,
    courseId: quiz.courseId,
    moduleId: quiz.moduleId,
    lessonId: quiz.lessonId,
    title: quiz.title,
    description: quiz.description,
    passingScore: quiz.passingScore,
    totalQuestions: questions.length,
    questions
  };
}

// -----------------------------------------------------------------------------
// Server-Only Grading & Attempt Persistence
// -----------------------------------------------------------------------------
export async function findPublishedQuizForServerGrading(quizId: string) {
  if (!isValidObjectId(quizId)) return null;

  if (isDatabaseConnected()) {
    const quiz = await Quiz.findById(quizId).lean();
    if (!quiz || quiz.status !== 'published') return null;

    const course = await findPublishedCourseSummaryById(quiz.courseId.toString());
    if (!course) return null;

    const questions = await QuizQuestion.find({ quizId: quiz._id })
      .select('+correctOptionIndex')
      .sort({ order: 1 })
      .lean();

    return {
      id: quiz._id.toString(),
      courseId: quiz.courseId.toString(),
      title: quiz.title,
      passingScore: quiz.passingScore,
      questions: questions.map((q) => ({
        id: q._id.toString(),
        prompt: q.prompt,
        options: q.options,
        correctOptionIndex: q.correctOptionIndex,
        explanation: q.explanation || '',
        order: q.order
      }))
    };
  }

  ensureDefaultMemoryQuizzes();
  const quiz = memoryQuizzes.find((q) => q.id === quizId && q.status === 'published');
  if (!quiz) return null;

  const course = await findPublishedCourseSummaryById(quiz.courseId);
  if (!course) return null;

  const questions = memoryQuestions
    .filter((q) => q.quizId === quiz.id)
    .sort((a, b) => a.order - b.order)
    .map((q) => ({ ...q, options: [...q.options] }));

  return {
    id: quiz.id,
    courseId: quiz.courseId,
    title: quiz.title,
    passingScore: quiz.passingScore,
    questions
  };
}

export async function countUserAttemptsForQuiz(userId: string, quizId: string): Promise<number> {
  if (!isValidObjectId(userId) || !isValidObjectId(quizId)) return 0;

  if (isDatabaseConnected()) {
    return QuizAttempt.countDocuments({ userId, quizId });
  }

  ensureDefaultMemoryQuizzes();
  return memoryAttempts.filter((a) => a.userId === userId && a.quizId === quizId).length;
}

export async function createQuizAttemptRecord(input: {
  userId: string;
  quizId: string;
  answers: Record<string, number>;
  score: number;
  totalQuestions: number;
  passed: boolean;
}) {
  const now = new Date();

  if (isDatabaseConnected()) {
    const created = await QuizAttempt.create({
      userId: input.userId,
      quizId: input.quizId,
      answers: input.answers,
      score: input.score,
      totalQuestions: input.totalQuestions,
      passed: input.passed,
      attemptedAt: now
    });

    return {
      id: created._id.toString(),
      userId: created.userId.toString(),
      quizId: created.quizId.toString(),
      score: created.score,
      totalQuestions: created.totalQuestions,
      passed: created.passed,
      attemptedAt: created.attemptedAt.toISOString()
    };
  }

  ensureDefaultMemoryQuizzes();
  const record: StoredQuizAttemptRecord = {
    id: new mongoose.Types.ObjectId().toString(),
    userId: input.userId,
    quizId: input.quizId,
    answers: { ...input.answers },
    score: input.score,
    totalQuestions: input.totalQuestions,
    passed: input.passed,
    attemptedAt: now
  };
  memoryAttempts.push(record);

  return {
    id: record.id,
    userId: record.userId,
    quizId: record.quizId,
    score: record.score,
    totalQuestions: record.totalQuestions,
    passed: record.passed,
    attemptedAt: record.attemptedAt.toISOString()
  };
}

export async function listQuizAttemptsForUser(userId: string) {
  if (!isValidObjectId(userId)) return [];

  if (isDatabaseConnected()) {
    const docs = await QuizAttempt.find({ userId }).sort({ attemptedAt: -1 }).lean();
    return Promise.all(
      docs.map(async (d) => {
        const quiz = await Quiz.findById(d.quizId).lean();
        const percentage =
          d.totalQuestions > 0 ? Math.round((d.score / d.totalQuestions) * 100) : 0;
        return {
          id: d._id.toString(),
          quizId: d.quizId.toString(),
          quizTitle: quiz?.title || 'Assessment',
          courseId: quiz ? quiz.courseId.toString() : null,
          score: d.score,
          total: d.totalQuestions,
          totalQuestions: d.totalQuestions,
          maxScore: d.totalQuestions,
          percentage,
          passed: d.passed,
          attemptedAt: new Date(d.attemptedAt).toISOString()
        };
      })
    );
  }

  ensureDefaultMemoryQuizzes();
  return memoryAttempts
    .filter((a) => a.userId === userId)
    .sort((a, b) => b.attemptedAt.getTime() - a.attemptedAt.getTime())
    .map((a) => {
      const quiz = memoryQuizzes.find((q) => q.id === a.quizId);
      const percentage =
        a.totalQuestions > 0 ? Math.round((a.score / a.totalQuestions) * 100) : 0;
      return {
        id: a.id,
        quizId: a.quizId,
        quizTitle: quiz?.title || 'Assessment',
        courseId: quiz?.courseId ?? null,
        score: a.score,
        total: a.totalQuestions,
        totalQuestions: a.totalQuestions,
        maxScore: a.totalQuestions,
        percentage,
        passed: a.passed,
        attemptedAt: a.attemptedAt.toISOString()
      };
    });
}

// -----------------------------------------------------------------------------
// Admin Quiz CMS Operations (Used ONLY by /api/v1/admin/* with admin RBAC)
// -----------------------------------------------------------------------------
export async function countQuizMetrics(): Promise<{
  totalQuizzes: number;
  totalQuizAttempts: number;
}> {
  if (isDatabaseConnected()) {
    const [totalQuizzes, totalQuizAttempts] = await Promise.all([
      Quiz.countDocuments(),
      QuizAttempt.countDocuments()
    ]);
    return { totalQuizzes, totalQuizAttempts };
  }

  ensureDefaultMemoryQuizzes();
  return {
    totalQuizzes: memoryQuizzes.length,
    totalQuizAttempts: memoryAttempts.length
  };
}

export async function adminListAllQuizzes() {
  if (isDatabaseConnected()) {
    const quizzes = await Quiz.find().sort({ updatedAt: -1 }).lean();
    return Promise.all(
      quizzes.map(async (q) => {
        const [questionCount, course] = await Promise.all([
          QuizQuestion.countDocuments({ quizId: q._id }),
          findAnyCourseSummaryById(q.courseId.toString())
        ]);
        return {
          id: q._id.toString(),
          courseId: q.courseId.toString(),
          courseTitle: course?.title || 'Unknown Course',
          moduleId: q.moduleId ? q.moduleId.toString() : null,
          lessonId: q.lessonId ? q.lessonId.toString() : null,
          title: q.title,
          description: q.description || '',
          passingScore: q.passingScore,
          status: q.status,
          questions: questionCount,
          questionCount
        };
      })
    );
  }

  ensureDefaultMemoryQuizzes();
  return Promise.all(
    [...memoryQuizzes]
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .map(async (q) => {
        const course = await findAnyCourseSummaryById(q.courseId);
        const questionCount = memoryQuestions.filter((qq) => qq.quizId === q.id).length;
        return {
          id: q.id,
          courseId: q.courseId,
          courseTitle: course?.title || 'Unknown Course',
          moduleId: q.moduleId,
          lessonId: q.lessonId,
          title: q.title,
          description: q.description,
          passingScore: q.passingScore,
          status: q.status,
          questions: questionCount,
          questionCount
        };
      })
  );
}

export interface AdminQuizQuestionInput {
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
  order?: number;
}

export async function adminCreateQuizWithQuestions(input: {
  courseId: string;
  moduleId?: string;
  lessonId?: string;
  title: string;
  description?: string;
  passingScore?: number;
  status?: 'draft' | 'published';
  questions?: AdminQuizQuestionInput[];
}) {
  const course = await findAnyCourseSummaryById(input.courseId);
  if (!course) return null;

  const status = input.status ?? 'draft';
  const passingScore = input.passingScore ?? 1;

  if (isDatabaseConnected()) {
    const createdQuiz = await Quiz.create({
      courseId: input.courseId,
      ...(input.moduleId && isValidObjectId(input.moduleId) ? { moduleId: input.moduleId } : {}),
      ...(input.lessonId && isValidObjectId(input.lessonId) ? { lessonId: input.lessonId } : {}),
      title: input.title.trim(),
      description: input.description?.trim() ?? '',
      passingScore,
      status
    });

    const createdQuestions = [];
    if (input.questions && input.questions.length > 0) {
      const docs = await QuizQuestion.insertMany(
        input.questions.map((q, idx) => ({
          quizId: createdQuiz._id,
          prompt: q.prompt.trim(),
          options: q.options.map((o) => o.trim()),
          correctOptionIndex: q.correctOptionIndex,
          explanation: q.explanation?.trim() ?? '',
          order: q.order ?? idx + 1
        }))
      );
      for (const d of docs) {
        createdQuestions.push({
          id: d._id.toString(),
          prompt: d.prompt,
          options: d.options,
          correctOptionIndex: d.correctOptionIndex,
          explanation: d.explanation || '',
          order: d.order
        });
      }
    }

    return {
      id: createdQuiz._id.toString(),
      courseId: createdQuiz.courseId.toString(),
      moduleId: createdQuiz.moduleId ? createdQuiz.moduleId.toString() : null,
      lessonId: createdQuiz.lessonId ? createdQuiz.lessonId.toString() : null,
      title: createdQuiz.title,
      description: createdQuiz.description || '',
      passingScore: createdQuiz.passingScore,
      status: createdQuiz.status,
      questionCount: createdQuestions.length,
      questions: createdQuestions
    };
  }

  ensureDefaultMemoryQuizzes();
  const now = new Date();
  const quizId = new mongoose.Types.ObjectId().toString();
  const quizRec: StoredQuizRecord = {
    id: quizId,
    courseId: input.courseId,
    moduleId: input.moduleId ?? null,
    lessonId: input.lessonId ?? null,
    title: input.title.trim(),
    description: input.description?.trim() ?? '',
    passingScore,
    status,
    createdAt: now,
    updatedAt: now
  };
  memoryQuizzes.push(quizRec);

  const createdQuestions: StoredQuestionRecord[] = (input.questions ?? []).map((q, idx) => {
    const qRec: StoredQuestionRecord = {
      id: new mongoose.Types.ObjectId().toString(),
      quizId,
      prompt: q.prompt.trim(),
      options: q.options.map((o) => o.trim()),
      correctOptionIndex: q.correctOptionIndex,
      explanation: q.explanation?.trim() ?? '',
      order: q.order ?? idx + 1
    };
    memoryQuestions.push(qRec);
    return qRec;
  });

  return {
    id: quizRec.id,
    courseId: quizRec.courseId,
    moduleId: quizRec.moduleId,
    lessonId: quizRec.lessonId,
    title: quizRec.title,
    description: quizRec.description,
    passingScore: quizRec.passingScore,
    status: quizRec.status,
    questionCount: createdQuestions.length,
    questions: createdQuestions
  };
}

export async function adminUpdateQuizById(
  quizId: string,
  patch: Partial<{
    title: string;
    description: string;
    passingScore: number;
    status: 'draft' | 'published';
    questions: AdminQuizQuestionInput[];
  }>
) {
  if (!isValidObjectId(quizId)) return null;

  if (isDatabaseConnected()) {
    const existing = await Quiz.findById(quizId);
    if (!existing) return null;

    if (patch.title !== undefined) existing.title = patch.title.trim();
    if (patch.description !== undefined) existing.description = patch.description.trim();
    if (patch.passingScore !== undefined) existing.passingScore = patch.passingScore;
    if (patch.status !== undefined) existing.status = patch.status;
    await existing.save();

    if (patch.questions !== undefined) {
      await QuizQuestion.deleteMany({ quizId: existing._id });
      if (patch.questions.length > 0) {
        await QuizQuestion.insertMany(
          patch.questions.map((q, idx) => ({
            quizId: existing._id,
            prompt: q.prompt.trim(),
            options: q.options.map((o) => o.trim()),
            correctOptionIndex: q.correctOptionIndex,
            explanation: q.explanation?.trim() ?? '',
            order: q.order ?? idx + 1
          }))
        );
      }
    }

    const questionCount = await QuizQuestion.countDocuments({ quizId: existing._id });
    return {
      id: existing._id.toString(),
      courseId: existing.courseId.toString(),
      title: existing.title,
      description: existing.description || '',
      passingScore: existing.passingScore,
      status: existing.status,
      questionCount
    };
  }

  ensureDefaultMemoryQuizzes();
  const target = memoryQuizzes.find((q) => q.id === quizId);
  if (!target) return null;

  if (patch.title !== undefined) target.title = patch.title.trim();
  if (patch.description !== undefined) target.description = patch.description.trim();
  if (patch.passingScore !== undefined) target.passingScore = patch.passingScore;
  if (patch.status !== undefined) target.status = patch.status;
  target.updatedAt = new Date();

  if (patch.questions !== undefined) {
    memoryQuestions = memoryQuestions.filter((qq) => qq.quizId !== quizId);
    for (let idx = 0; idx < patch.questions.length; idx++) {
      const q = patch.questions[idx];
      memoryQuestions.push({
        id: new mongoose.Types.ObjectId().toString(),
        quizId,
        prompt: q.prompt.trim(),
        options: q.options.map((o) => o.trim()),
        correctOptionIndex: q.correctOptionIndex,
        explanation: q.explanation?.trim() ?? '',
        order: q.order ?? idx + 1
      });
    }
  }

  const questionCount = memoryQuestions.filter((qq) => qq.quizId === quizId).length;
  return {
    id: target.id,
    courseId: target.courseId,
    title: target.title,
    description: target.description,
    passingScore: target.passingScore,
    status: target.status,
    questionCount
  };
}
