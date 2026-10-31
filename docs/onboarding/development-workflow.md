# Development Workflow & Task Governance

**Project:** AXIVON LEARN  
**Organization:** Axivon Technologies  
**Tagline:** Learn. Build. Grow.  
**Document Version:** 1.0  
**Effective Date:** 2026-10-31  

---

## 1. Single Repository Rule: Preventing Fragmented Work

To eliminate confusion, duplication, and wasted effort when multiple interns and engineers contribute simultaneously, Axivon Technologies enforces the following non-negotiable repository policy:

1. **Strictly One Monorepo**: All contributors work in the exact same Git repository (`AXIVON-LEARN`).
2. **Zero Personal Clones or Parallel Codebases**: No intern or team member may create a disconnected repository, separate project directory, or independent side-project (e.g., `axivon-learn-john/`, `backend-v2-test/`). All work occurs inside the unified `apps/`, `packages/`, `design/`, or `docs/` structure.
3. **No Unclaimed Work**: No code may be written without an officially assigned **Task ID**. If an intern writes code without an assigned task, that code cannot be merged into `develop` or `main`.
4. **Folder-Level Ownership & Locks**: Before editing files in a folder, engineers must check the task registry below. Two engineers must never edit the same module simultaneously without a documented Full Stack pair-programming agreement.

---

## 2. End-to-End Task Lifecycle

Every feature or bug fix moves through six explicit states:

```
[PROPOSED] ──► [ASSIGNED] ──► [IN PROGRESS] ──► [CODE REVIEW] ──► [QA VERIFY] ──► [DONE]
```

1. **PROPOSED**: The Technical Project Manager logs a feature or requirement aligned with the product blueprint.
2. **ASSIGNED**: A specific engineer is designated as the primary owner, and a collaborating peer is assigned.
3. **IN PROGRESS**: The owner creates a designated feature branch (`feature/<team>-<task-name>`), marks the task status as `IN PROGRESS`, and implements the change.
4. **CODE REVIEW**: The owner creates a Pull Request referencing the Task ID. Automated CI checks run, and domain leads perform code review.
5. **QA VERIFY**: The QA team deploys or checks out the branch, executes acceptance criteria tests, and verifies zero regression.
6. **DONE**: The PR is merged into `develop` (or `main` upon release gate), and the task is marked `DONE`.

---

## 3. Mandatory Task Specification Schema

Every task tracked in Axivon Learn must contain the following required fields:

| Field | Description / Requirement |
| :--- | :--- |
| **Task ID** | Unique identifier (e.g., `TASK-FE-001`, `TASK-BE-002`, `TASK-DES-001`, `TASK-FS-001`). |
| **Feature Name** | Descriptive name of the capability or component. |
| **Assigned Owner** | Name and GitHub handle of the primary responsible engineer/intern. |
| **Collaborating Team** | Secondary discipline(s) required for integration (e.g., Backend, UI/UX). |
| **Relevant Folders** | Exact directory paths where modifications are permitted. |
| **Dependencies** | Upstream tasks or specifications that must be complete before starting. |
| **Acceptance Criteria** | Bulleted, verifiable requirements that define when the feature works. |
| **Testing Requirements**| Specific unit, integration, or visual tests required before PR approval. |
| **Current Status** | Current state: `PROPOSED`, `ASSIGNED`, `IN PROGRESS`, `REVIEW`, `QA`, `DONE`. |
| **Pull Request Ref** | Link or reference number to the associated Git PR (e.g., `#12`). |

---

## 4. Active Sprint Task Registry (Initial Baseline)

Below is the initial baseline task allocation for AXIVON LEARN Phase 1. All team members must reference this registry:

### 4.1 Architecture & Setup (Step 1 - Current)

#### `TASK-ARCH-001`: Complete Repository Architecture & Team Collaboration Setup
* **Assigned Owner:** Senior Software Architect / Development Lead
* **Collaborating Team:** All Teams (UI/UX, Frontend, Backend, QA, DevOps)
* **Relevant Folders:** Root, `apps/`, `packages/`, `design/`, `docs/`, `.github/`
* **Dependencies:** None (Baseline source documents approved)
* **Acceptance Criteria:**
  - Standardized monorepo directory tree created without premature dummy implementations.
  - Root `package.json`, `.gitignore`, `.editorconfig`, `.nvmrc`, and `.env.example` created.
  - Collaboration and governance guides (`CONTRIBUTING.md`, `team-ownership.md`, `development-workflow.md`, `design/README.md`) established.
  - Zero existing code destroyed or compromised.
* **Testing Requirements:** Git status validation, directory structure verification, environment variable placeholder review.
* **Current Status:** `IN PROGRESS`
* **Pull Request Ref:** Direct initialization on `main`

---

### 4.2 UI/UX Design Tracks (Upcoming Step 2 Preparation)

#### `TASK-DES-001`: Design System Tokens & Responsive Navigation Layout
* **Assigned Owner:** Lead UI/UX Designer
* **Collaborating Team:** Frontend Development
* **Relevant Folders:** `design/design-system/`, `design/screen-specifications/`, `design/handoff/`
* **Dependencies:** `TASK-ARCH-001`
* **Acceptance Criteria:**
  - Define primary color palette (brand purple/blue/slate), dark/light token system, and spacing scales.
  - Deliver responsive navigation specs for mobile drawer and desktop topbar.
  - Specify interactive states (hover, focus, active, disabled) for buttons and inputs.
* **Testing Requirements:** WCAG 2.1 AA contrast ratio audit (> 4.5:1 for normal text).
* **Current Status:** `ASSIGNED`
* **Pull Request Ref:** Pending branch `feature/uiux-design-tokens`

#### `TASK-DES-002`: Visitor-to-Learner Screen Wireframes & Specs
* **Assigned Owner:** UI/UX Designer (Intern / Associate)
* **Collaborating Team:** UI/UX Lead, Frontend Team
* **Relevant Folders:** `design/wireframes/`, `design/screen-specifications/`
* **Dependencies:** `TASK-DES-001`
* **Acceptance Criteria:**
  - Wireframes for Home (`/`), Catalog (`/courses`), Course Detail (`/courses/:slug`), and Auth (`/login`, `/register`).
  - Loading, empty, and error state wireframes for course catalog.
* **Testing Requirements:** Peer design review and frontend handoff checklist approval.
* **Current Status:** `PROPOSED`
* **Pull Request Ref:** Pending

---

### 4.3 Backend Engineering Tracks (Upcoming Step 2 Preparation)

#### `TASK-BE-001`: Express API Server Core & Security Middleware
* **Assigned Owner:** Backend Development Lead
* **Collaborating Team:** DevOps, Full Stack
* **Relevant Folders:** `apps/api/src/config/`, `apps/api/src/middleware/`, `apps/api/src/app.ts`, `apps/api/src/server.ts`
* **Dependencies:** `TASK-ARCH-001`
* **Acceptance Criteria:**
  - Express app configured with CORS, JSON body parser, request logger, and centralized error handler.
  - Standard `/api/v1` route prefix and `/api/v1/health` monitoring endpoint.
  - Environment variable schema validation on startup.
* **Testing Requirements:** Supertest health endpoint test, invalid route 404 test.
* **Current Status:** `PROPOSED`
* **Pull Request Ref:** Pending

#### `TASK-BE-002`: Authentication & Role-Based Access Control
* **Assigned Owner:** Backend Developer (Associate)
* **Collaborating Team:** Backend Lead, Frontend Team
* **Relevant Folders:** `apps/api/src/modules/auth/`, `apps/api/src/modules/users/`, `apps/api/src/middleware/authorize.ts`
* **Dependencies:** `TASK-BE-001`
* **Acceptance Criteria:**
  - User registration and login endpoints with password hashing (Argon2id/bcrypt).
  - JWT token generation or secure cookie session management.
  - Middleware enforcing `visitor`, `learner`, and `admin` permission gates.
  - Zero sensitive hashes returned in API payloads.
* **Testing Requirements:** Auth unit tests, duplicate email rejection test, unauthorized access rejection (401/403) tests.
* **Current Status:** `PROPOSED`
* **Pull Request Ref:** Pending

---

### 4.4 Frontend Engineering Tracks (Upcoming Step 2 Preparation)

#### `TASK-FE-001`: Vite React App Shell & Router Architecture
* **Assigned Owner:** Frontend Development Lead
* **Collaborating Team:** UI/UX Lead, Full Stack
* **Relevant Folders:** `apps/web/src/app/`, `apps/web/src/routes/`, `apps/web/src/components/layout/`
* **Dependencies:** `TASK-ARCH-001`, `TASK-DES-001`
* **Acceptance Criteria:**
  - Vite + React + TypeScript configuration initialized with aliases (`@/`).
  - React Router setup supporting Public Layout, Learner Layout, and Protected Admin Layout.
  - Global Header, Mobile Navigation Drawer, and Footer components rendered.
* **Testing Requirements:** Router rendering tests, responsive navigation toggle test.
* **Current Status:** `PROPOSED`
* **Pull Request Ref:** Pending

#### `TASK-FE-002`: Course Catalog & Detail View Implementation
* **Assigned Owner:** Frontend Developer (Associate)
* **Collaborating Team:** Frontend Lead, Backend Team
* **Relevant Folders:** `apps/web/src/features/catalog/`, `apps/web/src/features/courses/`, `apps/web/src/components/common/`
* **Dependencies:** `TASK-FE-001`, `TASK-BE-001`
* **Acceptance Criteria:**
  - Course card component displaying title, category, level, thumbnail fallback, and estimated duration.
  - Catalog page with category filter chips and responsive grid layout.
  - Course detail syllabus accordion showing modules and lessons.
  - Full loading skeleton, empty state, and API error retry state.
* **Testing Requirements:** Component render tests, empty state test, slug route matching test.
* **Current Status:** `PROPOSED`
* **Pull Request Ref:** Pending

---

## 5. Definition of Done (DoD) Checklist

A task is officially complete and eligible for merging only when all checkboxes are met:

- [ ] **Acceptance Criteria Met:** All bullet points in the task definition are satisfied.
- [ ] **No Secrets Committed:** Clean diff verified; no API keys, tokens, or `.env` files present.
- [ ] **Type Safety:** TypeScript passes compilation with zero type errors (`tsc --noEmit`).
- [ ] **Tests Written & Passing:** Unit/integration tests added and executing green.
- [ ] **UI States Covered:** Loading, Empty, Error, and Success states implemented for all user-facing features.
- [ ] **Responsive & Accessible:** Tested across desktop (1280px+), tablet (768px), and mobile (375px); accessible markup with semantic HTML.
- [ ] **Peer Review Approved:** Approved by the respective team lead or designated reviewer.
