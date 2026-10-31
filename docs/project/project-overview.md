# Project Overview: AXIVON LEARN

**Title:** AXIVON LEARN Project Overview  
**Purpose:** Comprehensive baseline summary of the product mission, organizational alignment, audience, and core architecture.  
**Status:** Approved Requirements  
**Owner:** Technical Project Manager / Software Architecture Lead  
**Last Updated:** 2026-10-31  
**Related Documents:** [Product Vision](file:///c:/Users/vk010/Downloads/startup/axivon%20project/axivon%20learn/project%20codebase/docs/project/product-vision.md), [Scope & MVP](file:///c:/Users/vk010/Downloads/startup/axivon%20project/axivon%20learn/project%20codebase/docs/project/scope-and-mvp.md)

---

## 1. Executive Summary

**AXIVON LEARN** is a standalone technology-learning platform engineered and operated by **Axivon Technologies**. Operating under the official tagline **"Learn. Build. Grow."**, the platform provides structured learning paths, curated lessons, multiple-choice quizzes, practical project briefs, and persistent progress tracking.

Crucially, **AXIVON LEARN is an independent product**—it is completely separate from the corporate Axivon Technologies marketing website. It operates with dedicated client routing, a standalone REST API server (`/api/v1`), and dedicated document persistence.

---

## 2. Core Product Promise

> *"A structured way to learn technology, practice the skills, and track progress."*

The value proposition of AXIVON LEARN is not an uncurated directory of random video links. Its primary value stems from:
1. **Sequential Structure:** Explicit prerequisites and curated syllabi guiding learners from foundational syntax to real-world deployment.
2. **Demonstrable Practice:** Lesson-linked multiple-choice quizzes and hands-on project briefs.
3. **Saved State & Persistence:** Automatic session and progress tracking across returning visits.
4. **Transparent Content Attribution:** Rigorous respect for educational intellectual property, leveraging permitted embeds with full author attribution.

---

## 3. High-Level Technology Architecture

The platform is engineered as a clean, modular monorepo:

| Layer | Technology | Architectural Role | Implementation Status |
| :--- | :--- | :--- | :--- |
| **Frontend** | React 18 + Vite + TypeScript | Client SPA, feature-based modules, responsive layout | Implemented |
| **Styling** | Vanilla CSS Design Tokens | High-contrast dark aesthetic, zero build-step bloat | Implemented |
| **Backend API**| Node.js + Express + TypeScript | REST API (`/api/v1`), validation, error handling | Implemented |
| **Database** | MongoDB + Mongoose | Syllabus hierarchies, user accounts, quiz scoring | Configured |
| **Auth** | Secure HTTP Cookies + JWT | Cryptographic session tokens, role gates | Implemented |
| **Shared** | Monorepo packages | Shared types, shared schemas, shared configuration | Implemented |

---

## 4. Primary User Journeys

### 4.1 The Learner Success Journey
```
[Visitor on /] ──► [Browse /courses] ──► [Select /courses/:slug] ──► [Register / Login]
      │
      ▼
[Open /learn/:courseSlug/:lessonId] ──► [Mark Complete] ──► [Attempt /quiz/:quizId]
      │
      ▼
[Score Evaluated on Server] ──► [View Updated Progress on /dashboard]
```

### 4.2 The Admin Content Journey
```
[Admin Login] ──► [/admin/courses] ──► [Create Draft Course] ──► [Add Modules & Lessons]
      │
      ▼
[Attach Assessment Quiz] ──► [Preview Syllabus] ──► [Publish to Public Catalog]
```

---

## 5. Scope Boundaries

- **P0 (Shipped MVP):** Catalog, syllabus view, auth, lesson player, progress toggles, MCQ quizzes, admin course CMS, responsive mobile/desktop UI.
- **P1 (Post-MVP Enhancements):** Advanced search filters, bookmarks, certificate verification.
- **P2 / Future (Out of Scope for MVP):** Payments, livestreaming, AI tutor, public marketplace, code sandboxes.
