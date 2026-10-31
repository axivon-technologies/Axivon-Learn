/**
 * AXIVON LEARN - Shared TypeScript Domain Contracts
 * Organization: Axivon Technologies
 *
 * This package defines the single source of truth for cross-stack data contracts,
 * preventing duplicated interfaces and synchronization mismatches between apps/web and apps/api.
 */

export type UserRole = 'visitor' | 'learner' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type PublicationStatus = 'draft' | 'published' | 'archived';

export interface LessonSummary {
  id: string;
  title: string;
  slug: string;
  order: number;
  durationMinutes?: number;
  isFreePreview: boolean;
}

export interface ModuleSummary {
  id: string;
  title: string;
  order: number;
  lessons: LessonSummary[];
}

export interface CourseSummary {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  level: CourseLevel;
  thumbnailUrl?: string;
  status: PublicationStatus;
  moduleCount: number;
  lessonCount: number;
  estimatedDurationHours?: number;
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  completedAt?: string;
}

export interface CourseEnrollmentProgress {
  courseId: string;
  enrolledAt: string;
  completedLessons: string[];
  progressPercent: number;
  lastAccessedLessonId?: string;
  completedAt?: string;
}

export interface QuizQuestionSummary {
  id: string;
  prompt: string;
  options: string[];
}

export interface QuizAttemptResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  attemptedAt: string;
}
