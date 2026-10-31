# Goals & Success Metrics: AXIVON LEARN

**Title:** Platform Goals & Quantitative Success Metrics  
**Purpose:** Defines tangible deliverables, technical performance indicators, and MVP delivery milestones.  
**Status:** Approved Requirements  
**Owner:** Technical Project Lead  
**Last Updated:** 2026-10-31  

---

## 1. Primary One-Month MVP Goals

1. **Working End-to-End Learner Journey:** Enable a new user to discover courses, enroll, consume lessons, complete quizzes, and observe persisted progress on their dashboard.
2. **Working Admin Content Management:** Enable an administrator to draft, structure, and publish a course, module, lesson, and quiz through a protected CMS UI without writing code.
3. **Robust Security Boundaries:** Enforce role-based access control (`visitor`, `learner`, `admin`) on all protected endpoints, with zero secrets in Git and safe password hashing.
4. **Responsive Experience:** High visual fidelity across desktop (1280px+), tablet (768px), and mobile (375px) viewports with complete coverage for loading, empty, and error states.

---

## 2. Technical Quality & Success Metrics

| Metric Dimension | Target Standard | Measurement Method | Implementation Status |
| :--- | :--- | :--- | :--- |
| **API Response Time** | < 150ms for cached/indexed catalog | Health and load tests | Implemented |
| **Code Coverage** | > 80% coverage on core auth & business logic | Vitest / Supertest suite | Baseline added |
| **Lighthouse Performance** | > 90 on Desktop, > 85 on Mobile | Chrome Lighthouse audit | Architecture ready |
| **WCAG Accessibility** | WCAG 2.1 Level AA compliance (contrast > 4.5:1) | Axe DevTools / Manual QA | Token system compliant |
| **Secret Hygiene** | 0 secrets or real credentials committed | Automated CI secret check | Implemented in CI |
| **Server Health** | 100% uptime on `/api/v1/health` endpoint | Process monitoring | Implemented |

---

## 3. Seed Content Targets for Launch

- **Learning Paths:** 2 Curated Tracks (AI/ML Foundations, Full Stack Web Development).
- **Courses:** 2 Complete Courses seeded with full syllabus hierarchies.
- **Lessons:** Initial seed lessons with study notes and permitted embed structures.
- **Quizzes:** Initial lesson-linked quizzes with server-side grading.
