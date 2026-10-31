# Frontend Routing Guide: AXIVON LEARN

**Title:** Client-Side Routing Architecture  
**Purpose:** Explains React Router v6 structure, layout nesting, and URL conventions.  
**Status:** Implemented  
**Owner:** Frontend Lead Engineer  
**Last Updated:** 2026-10-31  

---

## 1. Declarative Layout Routes
All routes are declared in `apps/web/src/routes/index.tsx` using `createBrowserRouter`:
- **Public Routes:** Wrapped in `<PublicLayout />` (`/`, `/courses`, `/courses/:slug`, `/learning-paths`, legal pages).
- **Auth Routes:** Wrapped in `<AuthLayout />` (`/login`, `/register`).
- **Learner Routes:** Wrapped in `<LearnerLayout />` (`/dashboard`, `/my-learning`, `/learn/:courseSlug/:lessonId`, `/quiz/:quizId`, `/profile`, `/settings`).
- **Admin Routes:** Wrapped in `<AdminLayout />` (`/admin`, `/admin/courses`, `/admin/courses/new`, `/admin/courses/:id/edit`, `/admin/categories`, `/admin/quizzes`).
- **Catch-All (404):** `*` renders `<NotFoundPage />`.
