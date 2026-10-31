# Acceptance Criteria: AXIVON LEARN

**Title:** Detailed Feature Acceptance Criteria (Definition of Done)  
**Purpose:** Verifiable, testable criteria for every P0 MVP feature.  
**Status:** Approved Requirements & Validated  
**Owner:** QA Lead & Technical Project Lead  
**Last Updated:** 2026-10-31  

---

## 1. Public Catalog & Course Detail Criteria

### Acceptance Checks for `/courses`:
- [x] Only courses with `status === "published"` are returned to visitors.
- [x] Category filter chips filter the course list dynamically.
- [x] Search input filters courses by title and summary without page reload.
- [x] An empty state with a helpful call-to-action is displayed if no courses match.
- [x] Loading skeletons are rendered while data is fetching from `/api/v1/courses`.

### Acceptance Checks for `/courses/:slug`:
- [x] Matches slug parameter and displays course title, category, level, and duration.
- [x] Renders outcomes as a bulleted checklist.
- [x] Renders ordered syllabus modules and lessons.
- [x] If slug is invalid or course is in `draft` state, displays a structured 404 state with a return link.

---

## 2. Authentication Acceptance Criteria

### Acceptance Checks for `/register` & `/login`:
- [x] Reject registration if password is fewer than 8 characters.
- [x] Reject registration if email is invalid or already registered.
- [x] Issue secure JWT token upon successful authentication.
- [x] Clear session cookie upon calling `POST /api/v1/auth/logout`.
- [x] Return 401 Unauthorized when attempting to access `/dashboard` or `/profile` without active credentials.

---

## 3. Progress Tracking & Quiz Criteria

### Acceptance Checks for `/learn/:courseSlug/:lessonId`:
- [x] Video player preserves a 16:9 aspect ratio and renders fallback on embed errors.
- [x] Clicking "Mark as Complete" updates the button state and recalculates course progress.
- [x] Syllabus sidebar allows navigation between module lessons.

### Acceptance Checks for `/quiz/:quizId`:
- [x] Correct answer indices are **NOT** present in initial client questions payload.
- [x] Submitting answers calculates the score on the server and displays percentage.
- [x] If score is below passing mark, an option to retake the quiz is presented.

---

## 4. Admin CMS Criteria

### Acceptance Checks for `/admin/*`:
- [x] Non-admin users are rejected with HTTP 403 Forbidden.
- [x] Admin can save course title, category, level, outcomes, and change status between `draft` and `published`.
- [x] Publishing a course makes it immediately visible in the public `/courses` catalog.
