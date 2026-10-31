# Sitemap & Route Map: AXIVON LEARN

**Title:** Client Sitemap & Route Hierarchy  
**Purpose:** Comprehensive inventory of all public, learner, and administrative URLs and layouts.  
**Status:** Implemented  
**Owner:** UI/UX Lead & Frontend Lead  
**Last Updated:** 2026-10-31  

---

## 1. Route Map by Access Tier

| Path | Layout Container | Purpose / Page View | Target Role | Implementation Status |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `PublicLayout` | Landing page, value proposition, tracks preview | All Visitors | Implemented |
| `/courses` | `PublicLayout` | Course catalog with search & category filters | All Visitors | Implemented |
| `/courses/:slug` | `PublicLayout` | Course detail view, syllabus accordion, enrollment | All Visitors | Implemented |
| `/learning-paths` | `PublicLayout` | Curated sequences (AI/ML & Full Stack) | All Visitors | Implemented |
| `/about` | `PublicLayout` | Mission, corporate attribution, principles | All Visitors | Implemented |
| `/contact` | `PublicLayout` | Support inquiries & contact form | All Visitors | Implemented |
| `/privacy` | `PublicLayout` | Privacy notice & data processing terms | All Visitors | Implemented |
| `/terms` | `PublicLayout` | Platform terms of service | All Visitors | Implemented |
| `/content-policy` | `PublicLayout` | Attribution & YouTube embed policy | All Visitors | Implemented |
| `/login` | `AuthLayout` | Learner/Admin authentication form | Unauthenticated | Implemented |
| `/register` | `AuthLayout` | New learner registration form | Unauthenticated | Implemented |
| `/dashboard` | `LearnerLayout` | Enrolled courses, resume learning, progress bar | Learner / Admin | Implemented |
| `/my-learning` | `LearnerLayout` | Status filter tabs (all, in-progress, completed) | Learner / Admin | Implemented |
| `/learn/:courseSlug/:lessonId`| `LearnerLayout` | Lesson player, video embed, completion check | Learner / Admin | Implemented |
| `/quiz/:quizId` | `LearnerLayout` | Multiple-choice quiz player & score evaluation | Learner / Admin | Implemented |
| `/profile` | `LearnerLayout` | User details and role badge | Learner / Admin | Implemented |
| `/settings` | `LearnerLayout` | Account preferences & options | Learner / Admin | Implemented |
| `/admin` | `AdminLayout` | Administrative dashboard & metric overview | Admin Only | Implemented |
| `/admin/courses` | `AdminLayout` | Course table with draft/published badges | Admin Only | Implemented |
| `/admin/courses/new` | `AdminLayout` | Course creation editor form | Admin Only | Implemented |
| `/admin/courses/:id/edit`| `AdminLayout` | Course editing form & status toggle | Admin Only | Implemented |
| `/admin/categories` | `AdminLayout` | Category taxonomy manager | Admin Only | Implemented |
| `/admin/quizzes` | `AdminLayout` | Quiz and question management table | Admin Only | Implemented |
| `*` | `PublicLayout` | 404 Not Found error fallback | All Visitors | Implemented |
