# Team Ownership & Responsibility Matrix

**Project:** AXIVON LEARN  
**Organization:** Axivon Technologies  
**Tagline:** Learn. Build. Grow.  
**Document Version:** 1.0  
**Effective Date:** 2026-10-31  

---

## 1. Executive Purpose

To deliver a scalable, reliable MVP for **AXIVON LEARN** within an accelerated delivery timeline, the engineering organization operates under strict role boundaries, documented ownership, and shared integration contracts.

A single Git repository is shared across all disciplines. Clear ownership prevents overlapping code changes, accidental duplication, and conflicting implementations among engineers and interns.

---

## 2. Team Role Definitions & Core Ownership

### 2.1 UI/UX Design Team
* **Primary Role Focus:** User experience architecture, visual hierarchy, interaction fidelity, design tokens, and developer handoff.
* **Core Deliverables & Ownership:**
  - Complete user flows (Visitor to Learner, Admin Content Publishing, Returning Learner).
  - High-fidelity Figma screen layouts and component variants.
  - Design tokens (Color palettes, Typography scales, Spacing grid, Border radii, Shadows).
  - Responsive specifications for Mobile (320px–480px), Tablet (768px–1024px), and Desktop (1280px+).
  - Accessibility considerations (WCAG 2.1 AA color contrast, keyboard focus indicators, screen reader labels).
  - Developer handoff documentation, state definitions (Default, Hover, Focus, Active, Disabled, Loading, Empty, Error).
* **Working Directory:** `design/` (specifically `design-system/`, `user-flows/`, `wireframes/`, `screen-specifications/`, `exported-assets/`, `handoff/`).

---

### 2.2 Frontend Development Team
* **Primary Role Focus:** Client-side architecture, user interfaces, routing, state management, and API integration.
* **Core Deliverables & Ownership:**
  - React + Vite + TypeScript application architecture (`apps/web`).
  - Screen implementations based strictly on approved design specifications.
  - Reusable UI component library (`apps/web/src/components/common`, `layout`, `forms`, `feedback`).
  - Feature-sliced modules (`apps/web/src/features/*`).
  - Client-side routing, route guards, and protected layouts (`apps/web/src/routes`).
  - Form validation with visible field-level error messages.
  - Complete state coverage: Loading skeletons, empty states, error fallbacks, and success notifications.
  - Frontend unit and component tests (`apps/web/tests`).
* **Working Directory:** `apps/web/`.

---

### 2.3 Backend Development Team
* **Primary Role Focus:** Server-side architecture, RESTful API design, data models, security, and business logic.
* **Core Deliverables & Ownership:**
  - Node.js + Express + TypeScript modular architecture (`apps/api`).
  - Database schemas, models, and migrations (`apps/api/src/database/`).
  - REST API contracts conforming to `/api/v1` standards.
  - Authentication middleware (JWT/session verification, password hashing with Argon2id/bcrypt).
  - Role-based authorization middleware (`apps/api/src/middleware/authorize.ts`) strictly enforcing permissions for `visitor`, `learner`, and `admin`.
  - Request validation middleware enforcing schemas on params, queries, and bodies.
  - Robust domain modules (`apps/api/src/modules/*`): Auth, Users, Categories, Courses, Modules, Lessons, Enrollments, Progress, Quizzes, Projects, Admin.
  - Centralized error-handling, request logging, and API unit/integration tests (`apps/api/tests`).
* **Working Directory:** `apps/api/`.

---

### 2.4 Full Stack Development Team
* **Primary Role Focus:** Cross-stack integration, Admin CMS, shared contracts, end-to-end workflows, and developer experience.
* **Core Deliverables & Ownership:**
  - Alignment of data contracts between frontend and backend via shared packages (`packages/shared-types`, `packages/shared-schemas`, `packages/shared-config`).
  - Admin Content Management System (CMS) end-to-end flow: Course creation, module/lesson management, quiz builder, and publishing pipeline.
  - Seed scripts and local developer bootstrap fixtures (`scripts/`).
  - End-to-end data flow validation and cross-boundary defect triage.
  - Resolution of integration blockers between frontend consumers and backend providers.
* **Working Directory:** Cross-cutting across `packages/*`, `apps/web/src/features/admin`, `apps/api/src/modules/admin`, and `scripts/`.

---

### 2.5 QA and Testing Team
* **Primary Role Focus:** Quality assurance, defect detection, test automation, and release acceptance verification.
* **Core Deliverables & Ownership:**
  - Comprehensive Test Plan and Acceptance Criteria verification (`docs/testing/`).
  - End-to-end test scenarios covering core user journeys:
    1. Discovery to enrollment.
    2. Lesson consumption and progress persistence.
    3. Quiz attempt and score validation.
    4. Admin authoring and publishing lifecycle.
    5. Security boundaries (unauthorized access rejection).
  - Regression test suites, boundary checks, and exploratory testing.
  - Defect logging, reproducibility steps, and verification before PR merges.
* **Working Directory:** `tests/` and `docs/testing/`.

---

### 2.6 DevOps and Deployment Team
* **Primary Role Focus:** Environment orchestration, CI/CD pipelines, containerization, hosting configuration, and operational health.
* **Core Deliverables & Ownership:**
  - CI/CD workflow automation via GitHub Actions (`.github/workflows/`).
  - Environment templates (`.env.example`) and configuration hygiene.
  - Infrastructure as Code and deployment runbooks (`infrastructure/` and `docs/deployment/`).
  - Static frontend build optimization (Vite build targets, asset compression).
  - Backend process management, database connection reliability, and server health check monitoring.
* **Working Directory:** `infrastructure/`, `.github/workflows/`, and `docs/deployment/`.

---

### 2.7 Project Management and Documentation Team
* **Primary Role Focus:** Technical project governance, schedule tracking, sprint planning, and architectural documentation.
* **Core Deliverables & Ownership:**
  - Central project documentation (`docs/project/`, `docs/architecture/`, `docs/requirements/`, `docs/decisions/`).
  - Maintenance of the Development Workflow and Task Registry (`docs/onboarding/development-workflow.md`).
  - Sprint cadence, milestone gating, and dependency tracking.
* **Working Directory:** `docs/` and root documentation (`README.md`, `CONTRIBUTING.md`).

---

## 3. Team Responsibility & Cross-Interface Matrix

| Discipline | Upstream Dependency | Downstream Deliverable | Handoff Contract |
| :--- | :--- | :--- | :--- |
| **UI/UX Design** | Product Blueprint & Requirements | Screen Specs & Design Tokens | Figma link, token variables, state checklist |
| **Backend Dev** | Requirements & Shared Types | Documented REST API (`/api/v1`) | OpenAPI / Swagger spec, Postman collection, working seed data |
| **Frontend Dev** | Design Specs & API Contracts | Responsive Client Application | Component storybook/demos, working pages connected to mock/live API |
| **Full Stack Dev**| Frontend & Backend Modules | Admin CMS & Shared Packages | Validated end-to-end flows, synced shared packages |
| **QA / Testing** | Feature PRs & Acceptance Criteria | QA Sign-off & Defect Reports | Test run reports, automated regression suite |
| **DevOps** | Built Artifacts & Config Specs | Staging / Production Environments | CI/CD build status, live preview URLs, health endpoints |

---

## 4. Conflict Resolution & Architectural Escalation

1. **Specification Divergence:** If frontend and backend developers identify an ambiguous data model, they must NOT invent competing ad-hoc interfaces. The issue must be raised immediately to the **Full Stack Lead** and documented in `packages/shared-types`.
2. **Scope Alterations:** No engineer may unilaterally add out-of-scope features (e.g., payment gateways, AI tutoring, livestreaming). All additions must adhere strictly to the MVP priorities (P0 vs P1/P2).
3. **Branch Protection:** Any PR attempting to bypass CI checks, commit secrets, or disable authorization checks will be blocked immediately.
