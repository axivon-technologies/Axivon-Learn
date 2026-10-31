# Screen Specifications: AXIVON LEARN

**Title:** Detailed Screen-by-Screen UX & Data Specifications  
**Purpose:** Comprehensive guide for frontend engineers specifying layout, required components, data dependencies, and state coverage for every route.  
**Status:** Implemented  
**Owner:** UI/UX Lead & Frontend Lead  
**Last Updated:** 2026-10-31  

---

## 1. Public Landing Page (`/`)

* **Route:** `/`
* **Layout:** `PublicLayout`
* **Intended User:** All Visitors
* **Required Components:** Hero gradient, live API health badge, value proposition cards, featured learning path cards, how-it-works process steps, global footer.
* **Data Dependencies:** `GET /api/v1/health` (live connectivity check).
* **States:**
  - *Loading:* Skeleton pills on health status.
  - *Offline:* Informative warning badge showing local API offline or pending startup.
* **Acceptance Criteria:** Hero CTA routes to `/courses`. Responsive navigation drawer works on mobile viewports.

---

## 2. Course Catalog (`/courses`)

* **Route:** `/courses`
* **Layout:** `PublicLayout`
* **Intended User:** All Visitors
* **Required Components:** Page header, category filter chips (`all`, `AI & Machine Learning`, `Web Development`, `Cloud & DevOps`), search input, responsive course cards grid.
* **Data Dependencies:** `GET /api/v1/courses?category=...`
* **States:**
  - *Loading:* `<LoadingState />` rendering 3 shimmer cards.
  - *Empty:* `<EmptyState />` with "Clear Filters" or "Open Admin CMS" action.
  - *Error:* `<ErrorState />` with retry button.
* **Acceptance Criteria:** Filters courses by category and search term. Clicking a card navigates to `/courses/:slug`.

---

## 3. Course Details View (`/courses/:slug`)

* **Route:** `/courses/:slug`
* **Layout:** `PublicLayout`
* **Intended User:** All Visitors & Enrolled Learners
* **Required Components:** Breadcrumbs, level/category badges, summary, "What You Will Learn" outcomes checklist, syllabus module accordion, lesson rows, sticky enrollment card.
* **Data Dependencies:** `GET /api/v1/courses/:slug`
* **States:**
  - *Loading:* Multi-row skeleton loader.
  - *Not Found:* 404 state with "Back to Catalog" button.
* **Acceptance Criteria:** Validates slug against API. Enrollment CTA toggles to enrolled state and provides dashboard link.

---

## 4. Lesson Player (`/learn/:courseSlug/:lessonId`)

* **Route:** `/learn/:courseSlug/:lessonId`
* **Layout:** `LearnerLayout`
* **Intended User:** Authenticated Learners
* **Required Components:** 16:9 responsive video container, action bar (mark complete toggle, quiz link), study notes, syllabus drawer.
* **Data Dependencies:** `GET /api/v1/courses/:slug`, `POST /api/v1/progress/:lessonId/complete`
* **Acceptance Criteria:** Marks lesson complete without full page reload.

---

## 5. Assessment Quiz Player (`/quiz/:quizId`)

* **Route:** `/quiz/:quizId`
* **Layout:** `LearnerLayout`
* **Intended User:** Authenticated Learners
* **Required Components:** Question cards with radio options, submit assessment button, score result banner, retake button.
* **Data Dependencies:** `GET /api/v1/quizzes/:quizId`, `POST /api/v1/quizzes/:quizId/submit`
* **Acceptance Criteria:** Correct answers are private until evaluation. Score percentage calculated and displayed.
