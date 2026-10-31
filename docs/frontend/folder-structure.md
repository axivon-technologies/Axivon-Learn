# Frontend Folder Structure: AXIVON LEARN

**Title:** Frontend Directory Architecture  
**Purpose:** Details feature-sliced architecture and module layout in `apps/web`.  
**Status:** Implemented  
**Owner:** Frontend Lead Engineer  
**Last Updated:** 2026-10-31  

---

## 1. Directory Tree
```text
apps/web/src/
├── app/               # Root App component and QueryClientProvider
├── assets/            # Static media and brand illustrations
├── components/        # Shared presentation primitives
│   ├── common/        # Buttons, chips, cards, modals
│   ├── layout/        # PublicLayout, AuthLayout, LearnerLayout, AdminLayout, Header, Footer
│   ├── forms/         # Reusable form controls
│   └── feedback/      # LoadingState, EmptyState, ErrorState, SuccessAlert
├── features/          # Domain-driven capability modules
│   ├── auth/          # LoginPage, RegisterPage
│   ├── catalog/       # HomePage, CoursesCatalogPage, AboutPage, ContactPage, Legal pages
│   ├── courses/       # CourseDetailPage
│   ├── learning-paths/# LearningPathsPage
│   ├── lessons/       # LessonPlayerPage
│   ├── quizzes/       # QuizPlayerPage
│   ├── progress/      # DashboardPage, MyLearningPage
│   ├── profile/       # ProfilePage, SettingsPage
│   └── admin/         # AdminOverviewPage, AdminCoursesPage, AdminCourseEditorPage, etc.
├── routes/            # React Router v6 browser router definitions
└── styles/            # Core CSS design tokens & utilities (index.css)
```
