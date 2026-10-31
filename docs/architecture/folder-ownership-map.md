# Preliminary Folder Ownership Map

**Project:** AXIVON LEARN  
**Organization:** Axivon Technologies  
**Tagline:** Learn. Build. Grow.  
**Version:** 1.0  
**Effective Date:** 2026-10-31  

---

## 1. Purpose

This folder-ownership map establishes unambiguous boundaries across the **AXIVON LEARN** monorepo. It details which discipline owns each directory, which team collaborates, and what engineering standards must be preserved within each module.

---

## 2. Master Ownership Directory Map

| Path | Primary Owner | Collaborator(s) | Technical Scope & Responsibilities |
| :--- | :--- | :--- | :--- |
| `apps/web/` | Frontend Dev Team | UI/UX, Full Stack | React + Vite + TypeScript single-page application. Client-side routes, layouts, UI components, API services, form validations, loading/error states. |
| `apps/web/src/components/common/` | Frontend Dev Team | UI/UX Design | Shared UI primitives (Buttons, Chips, Cards, Badges, Modals, Tooltips). Strictly reusable. |
| `apps/web/src/components/layout/` | Frontend Dev Team | UI/UX Design | App Shell, Navigation Header, Drawer, Footer, Breadcrumbs, Protected Page Containers. |
| `apps/web/src/components/forms/` | Frontend Dev Team | Full Stack | Reusable input fields, select boxes, checkboxes, validation error displays. |
| `apps/web/src/components/feedback/`| Frontend Dev Team | UI/UX Design | Loading skeletons, empty states, error banners, success toast notifications. |
| `apps/web/src/features/auth/` | Frontend Dev Team | Backend Dev | Register, Login, Logout, Forgot Password views, Auth state hooks and guards. |
| `apps/web/src/features/catalog/` | Frontend Dev Team | UI/UX Design | Course catalog view, category filtering, search, pagination. |
| `apps/web/src/features/courses/` | Frontend Dev Team | Backend Dev | Course overview, syllabus accordion, enrollment CTA, instructor/source attribution. |
| `apps/web/src/features/learning-paths/` | Frontend Dev Team | UI/UX Design | Curated learning track sequences (AI/ML Foundations, Full Stack Foundations). |
| `apps/web/src/features/lessons/` | Frontend Dev Team | Full Stack | Lesson player, syllabus sidebar, video embed player, next/previous actions. |
| `apps/web/src/features/progress/` | Frontend Dev Team | Backend Dev | Progress indicators, completion checkmarks, dashboard metrics display. |
| `apps/web/src/features/quizzes/` | Frontend Dev Team | Backend Dev | Quiz question interface, option selection, submit handler, score display. |
| `apps/web/src/features/projects/` | Frontend Dev Team | Full Stack | Practical project briefs, prerequisites, deliverables view. |
| `apps/web/src/features/profile/` | Frontend Dev Team | Backend Dev | Learner profile and settings view. |
| `apps/web/src/features/admin/` | Full Stack Team | Frontend, Backend | Admin content management views: course creator, module/lesson editor, quiz builder. |
| `apps/web/src/services/` | Frontend Dev Team | Backend Dev | API client wrapper, endpoints, HTTP request/response interceptors. |
| `apps/api/` | Backend Dev Team | Full Stack, DevOps | Node.js + Express + TypeScript REST API. |
| `apps/api/src/config/` | Backend Dev Team | DevOps | Environment schema validation, server constants, database config. |
| `apps/api/src/database/` | Backend Dev Team | Full Stack | Database connection lifecycle, migration/seed handlers, Mongoose schemas. |
| `apps/api/src/middleware/` | Backend Dev Team | Security, DevOps | JWT authentication, role authorization, validation middleware, error handler. |
| `apps/api/src/modules/auth/` | Backend Dev Team | Security | User authentication, token issuance, password hashing, session lifecycle. |
| `apps/api/src/modules/users/` | Backend Dev Team | Full Stack | User management, profile operations, role permissions. |
| `apps/api/src/modules/courses/` | Backend Dev Team | Full Stack | Course metadata, CRUD operations, publication status filtering. |
| `apps/api/src/modules/modules/` | Backend Dev Team | Full Stack | Syllabus module ordering, course-module relationships. |
| `apps/api/src/modules/lessons/` | Backend Dev Team | Full Stack | Lesson contents, permitted video URLs, source attribution, ordering. |
| `apps/api/src/modules/enrollments/` | Backend Dev Team | Full Stack | Learner course enrollment records and verification. |
| `apps/api/src/modules/progress/` | Backend Dev Team | Full Stack | Lesson completion tracking, progress percentage calculations. |
| `apps/api/src/modules/quizzes/` | Backend Dev Team | Full Stack | Quiz questions, submission grading, score recording (answers hidden from public API). |
| `apps/api/src/modules/admin/` | Full Stack Team | Backend Dev | Administrative endpoints, content management, auditing. |
| `packages/shared-types/` | Full Stack Team | Frontend, Backend | Single source of truth for cross-stack TypeScript interfaces and types. |
| `packages/shared-schemas/` | Full Stack Team | Frontend, Backend | Shared validation schemas (e.g., Zod) ensuring uniform rules on client and server. |
| `packages/shared-config/` | Full Stack Team | DevOps | Shared configuration presets, role enums, pagination defaults. |
| `design/` | UI/UX Design Team | Frontend Dev | Figma links, tokens, user flows, wireframes, screen specs, exported assets. |
| `docs/` | Project Lead | All Teams | Master architecture, API specs, onboarding, decision records, security notes. |
| `scripts/` | Full Stack / DevOps | Backend Dev | Database seeders, local development bootstrappers, utility automation. |
| `infrastructure/` | DevOps Team | Backend Dev | Docker, Nginx, deployment templates, hosting runbooks. |
| `tests/` | QA & Testing Team | All Teams | Cross-system end-to-end integration tests and test run reports. |
| `.github/` | DevOps Team | Project Lead | GitHub Actions CI/CD workflows, issue templates, PR governance. |

---

## 3. Modification Rules & Cross-Boundary Protocol

1. **Self-Contained Changes**: Frontend developers work exclusively within `apps/web/`. Backend developers work exclusively within `apps/api/`.
2. **Contract Changes**: If an API contract requires alteration, the change MUST begin with a proposed update to `packages/shared-types/` reviewed by the Full Stack or Backend Lead before modifying either app.
3. **No Foreign Directories**: Do not introduce top-level folders without an Architectural Decision Record (ADR) in `docs/decisions/`.
