import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Layouts
import PublicLayout from '../components/layout/PublicLayout';
import AuthLayout from '../components/layout/AuthLayout';
import LearnerLayout from '../components/layout/LearnerLayout';
import AdminLayout from '../components/layout/AdminLayout';

// Pages
import HomePage from '../features/catalog/HomePage';
import CoursesCatalogPage from '../features/catalog/CoursesCatalogPage';
import CourseDetailPage from '../features/courses/CourseDetailPage';
import LearningPathsPage from '../features/learning-paths/LearningPathsPage';
import LessonPlayerPage from '../features/lessons/LessonPlayerPage';
import QuizPlayerPage from '../features/quizzes/QuizPlayerPage';
import DashboardPage from '../features/progress/DashboardPage';
import MyLearningPage from '../features/progress/MyLearningPage';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import ProfilePage from '../features/profile/ProfilePage';
import SettingsPage from '../features/profile/SettingsPage';
import AdminOverviewPage from '../features/admin/AdminOverviewPage';
import AdminCoursesPage from '../features/admin/AdminCoursesPage';
import AdminCourseEditorPage from '../features/admin/AdminCourseEditorPage';
import AdminCategoriesPage from '../features/admin/AdminCategoriesPage';
import AdminQuizzesPage from '../features/admin/AdminQuizzesPage';
import AboutPage from '../features/catalog/AboutPage';
import ContactPage from '../features/catalog/ContactPage';
import PrivacyPage from '../features/catalog/PrivacyPage';
import TermsPage from '../features/catalog/TermsPage';
import ContentPolicyPage from '../features/catalog/ContentPolicyPage';
import NotFoundPage from './NotFoundPage';

export const router = createBrowserRouter([
  // Public Routes
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/courses', element: <CoursesCatalogPage /> },
      { path: '/courses/:slug', element: <CourseDetailPage /> },
      { path: '/learning-paths', element: <LearningPathsPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/privacy', element: <PrivacyPage /> },
      { path: '/terms', element: <TermsPage /> },
      { path: '/content-policy', element: <ContentPolicyPage /> }
    ]
  },

  // Auth Routes
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> }
    ]
  },

  // Authenticated Learner Routes
  {
    element: <LearnerLayout />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/my-learning', element: <MyLearningPage /> },
      { path: '/learn/:courseSlug/:lessonId', element: <LessonPlayerPage /> },
      { path: '/quiz/:quizId', element: <QuizPlayerPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/settings', element: <SettingsPage /> }
    ]
  },

  // Protected Admin Routes
  {
    element: <AdminLayout />,
    children: [
      { path: '/admin', element: <AdminOverviewPage /> },
      { path: '/admin/courses', element: <AdminCoursesPage /> },
      { path: '/admin/courses/new', element: <AdminCourseEditorPage /> },
      { path: '/admin/courses/:id/edit', element: <AdminCourseEditorPage /> },
      { path: '/admin/categories', element: <AdminCategoriesPage /> },
      { path: '/admin/quizzes', element: <AdminQuizzesPage /> }
    ]
  },

  // Fallback Not Found
  {
    path: '*',
    element: <PublicLayout />,
    children: [{ path: '*', element: <NotFoundPage /> }]
  }
]);

export default router;
