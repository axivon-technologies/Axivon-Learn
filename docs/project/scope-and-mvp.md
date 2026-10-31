# Scope & MVP Boundaries: AXIVON LEARN

**Title:** Scope Boundaries & Priority Tiers  
**Purpose:** Formal classification of features into P0 (MVP Must Ship), P1 (Post-MVP), and P2/Future (Out of Scope).  
**Status:** Approved Requirements  
**Owner:** Technical Project Manager / Lead Architect  
**Last Updated:** 2026-10-31  

---

## 1. Feature Priority Classification

AXIVON LEARN engineering strictly enforces three priority categories to guarantee reliable, predictable sprint delivery.

```
┌─────────────────────────────────────────────────────────────┐
│ P0: MVP MUST SHIP                                           │
│ Core learner and admin journeys, auth, progress, responsive  │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Only after P0 passes acceptance checks)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ P1: POST-MVP ENHANCEMENTS                                   │
│ Advanced search, bookmarks, certificates, rich filters      │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Future releases)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ P2 / OUT OF SCOPE                                           │
│ Payments, livestreaming, AI tutor, marketplace, sandboxes   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Detailed Scope Matrix

### 2.1 P0 — Required MVP Functionality (Current Build)

| Feature Area | Description | Implementation Status |
| :--- | :--- | :--- |
| **Public Landing Page** | Value prop, featured learning paths, catalog preview, footer | Implemented |
| **Course Catalog** | Published courses grid, category filter chips, search input | Implemented |
| **Course Details** | Syllabus accordion, outcomes, prerequisites, duration, enrollment CTA | Implemented |
| **Authentication** | Registration, login, session cookies, JWT token issuance | Implemented |
| **Learner Dashboard** | Continue Learning card, enrolled courses, progress bar | Implemented |
| **Lesson Player** | 16:9 responsive video container, study notes, mark complete button | Implemented |
| **Progress Persistence**| Lesson completion tracking and progress calculation | Implemented |
| **MCQ Quizzes** | Multi-choice questions, option selection, server scoring | Implemented |
| **Admin Course CMS** | Course listing, draft/published status, course editor form | Implemented |
| **Responsive UI** | Mobile drawer, tablet grid, desktop layout, accessibility tokens | Implemented |
| **Feedback States** | Loading skeleton, empty state, error banner, retry triggers | Implemented |
| **Health & Monitoring**| `/api/v1/health` endpoint with database connection status | Implemented |

---

### 2.2 P1 — Post-MVP Features (After P0 is Stable)

| Feature | Scope & Rationale | Status |
| :--- | :--- | :--- |
| **Full-Text Course Search** | Debounced server-side indexing on course titles and descriptions | Proposed |
| **Bookmark System** | Save lessons and courses for offline quick access | Proposed |
| **Project Library** | Interactive submission of external GitHub project URLs | Proposed |
| **Password Reset** | Tokenized email password reset flow | Proposed |
| **Verifiable Certificates**| Cryptographically verifiable completion badges | Pending Decision |

---

### 2.3 P2 / Out of Scope (Strictly Prohibited from Month-One MVP)

The following capabilities increase architectural complexity and security risk and are **NOT** permitted in the month-one build:
- **Payment Gateways & Subscriptions:** (Razorpay, Stripe, paid courses)
- **Livestreaming & Video Conferencing:** (WebRTC, Zoom integration)
- **Automated AI Tutoring:** (LLM chat agents, real-time code review)
- **Arbitrary Code Execution Sandbox:** (Docker containers running unvetted code)
- **Public Creator Marketplace:** (Unrestricted third-party course uploads)
- **Native Mobile Apps:** (iOS/Android builds; PWA responsive web is prioritized)
