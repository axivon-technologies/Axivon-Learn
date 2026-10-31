# Functional Requirements: AXIVON LEARN

**Title:** Functional Requirements Specification (FRS)  
**Purpose:** Detailed technical specifications of all user-facing and administrative system behaviors.  
**Status:** Approved Requirements & Implemented  
**Owner:** Technical Project Lead / Business Analyst  
**Last Updated:** 2026-10-31  

---

## 1. Public & Course Discovery (FR-PUB)

* **FR-PUB-01 (Landing Page):** The system shall display a public landing page featuring the value proposition, featured learning tracks, curriculum highlights, and how-it-works workflow.
* **FR-PUB-02 (Course Catalog):** The system shall render a searchable, filterable catalog displaying only courses with status `published`. Draft courses must remain hidden.
* **FR-PUB-03 (Course Details):** The system shall present course summaries, estimated completion hours, prerequisites, measurable outcomes, and the complete syllabus hierarchy.
* **FR-PUB-04 (Learning Paths):** The system shall display curated multi-course tracks (AI/ML Foundations, Full Stack Web Development) showing total estimated hours and skill tags.

---

## 2. Authentication & Account Management (FR-AUTH)

* **FR-AUTH-01 (Registration):** The system shall allow new users to register with full name, valid email, and a password (minimum 8 characters).
* **FR-AUTH-02 (Password Security):** Plaintext passwords must be salted and hashed with bcrypt/Argon2id before database storage.
* **FR-AUTH-03 (Login & Session):** The system shall authenticate valid credentials and issue an HTTP-only secure cookie and/or JWT bearer token.
* **FR-AUTH-04 (Logout):** The system shall invalidate the session by clearing cookies on client and server.

---

## 3. Learner Experience & Progress (FR-LRN)

* **FR-LRN-01 (Dashboard):** Authenticated learners shall view their enrolled courses, progress bars, and a quick-action link to resume their last accessed lesson.
* **FR-LRN-02 (Lesson Player):** The system shall render lessons with responsive video embeds (YouTube / permitted sources), study notes, and syllabus navigation.
* **FR-LRN-03 (Lesson Completion):** Learners shall have the ability to toggle lesson completion status, triggering automatic recalculated course progress percentage.
* **FR-LRN-04 (Quiz Execution):** The system shall present multiple-choice questions without exposing the answer key, evaluate submissions server-side, and persist scores.

---

## 4. Admin Content Management (FR-ADM)

* **FR-ADM-01 (Access Gate):** Administrative views (`/admin/*`) and APIs (`/api/v1/admin/*`) must strictly require authenticated users with role `admin`.
* **FR-ADM-02 (Course CRUD):** Admins shall have the ability to create, update, draft, archive, and publish courses with validated slugs and metadata.
* **FR-ADM-03 (Syllabus Hierarchy):** Admins shall have the ability to create modules, order lessons, attach video URLs, and add source attributions.
* **FR-ADM-04 (Quiz Authoring):** Admins shall have the ability to create quiz questions, configure multiple options, mark the correct option index, and provide explanations.
