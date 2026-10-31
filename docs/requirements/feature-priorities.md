# Feature Priorities & Resolution Matrix: AXIVON LEARN

**Title:** Feature Priority Mapping & Source Blueprint Resolution  
**Purpose:** Reconciles priorities across source documents and records any differences.  
**Status:** Approved Requirements  
**Owner:** Technical Project Manager  
**Last Updated:** 2026-10-31  

---

## 1. Resolution Across Source Documents

The requirements baseline was consolidated from three uploaded documents:
1. *Axivon Learn Complete Product, Technical & Business Blueprint* (24 pages)
2. *Axivon Learn Team Project Overview* (6 pages)
3. *Axivon Learn UI/UX + Frontend Detailed Specification* (9 pages)

### Document Harmony & Differences Noted:

| Feature Dimension | Blueprint Classification | Team Overview Classification | Final Resolved Status | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **Catalog Category Filters** | Release 1.1 | P0 Core Screen | **P0 (Resolved)** | Simple client filter provides essential UX without complex backend work. |
| **Search Functionality** | Release 1.1 | P1 (If P0 is stable) | **P1 (Client search in P0, Full-text in P1)** | Basic client search included; server-side text indexing deferred to P1. |
| **Password Reset via Email**| Release 1.1 | P1 | **P1 (Post-MVP)** | Requires SMTP server / SendGrid; local auth prioritized for month-one. |
| **Project Briefs** | Release 1.1 | Curated P0 presentation | **P0 View, P1 Submission** | Static project briefs displayed; student submission portal in P1. |
| **Payment Gateways** | Release 2.0 | Out of Scope | **P2 (Out of Scope)** | Preserves non-commercial MVP velocity. |
| **Instructor Marketplace** | Release 2.0 | Out of Scope | **P2 (Out of Scope)** | Multi-tenant creator workflows require separate moderation tools. |

---

## 2. Definitive MVP Feature List (P0)

1. **Public Discovery:** Home, Published Catalog, Course Detail with Syllabus.
2. **Identity:** Register, Login, Session Management, Learner Profile.
3. **Core Learning Journey:** Lesson Player, Embedded Resources, Lesson Completion.
4. **Assessment:** Multiple-Choice Quizzes with server evaluation.
5. **Dashboard:** Enrolled Courses, Progress Tracking.
6. **Authoring:** Admin Course List, Course Editor, Module/Lesson Manager, Quiz Builder.
7. **Infrastructure & Quality:** `/api/v1/health` monitoring, Error boundaries, Skeletons, Zero-secrets policy.
