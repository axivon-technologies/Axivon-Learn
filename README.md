# AXIVON LEARN

> **Tagline:** Learn. Build. Grow.  
> **Organization:** Axivon Technologies  
> **Repository:** AXIVON-LEARN  
> **Status:** Step 1 Complete (Repository Architecture & Team Collaboration Setup)

---

## 1. Project Overview

**AXIVON LEARN** is a standalone technology-learning platform designed and engineered by **Axivon Technologies**. It enables aspiring developers, students, and practitioners to pursue structured, outcome-driven learning paths, study curated lessons, practice through interactive quizzes, complete real-world project briefs, and verifiably track their progress.

It is an independent product—engineered with its own dedicated infrastructure, frontend application, backend REST API, and data storage.

### Core Capabilities:
- **Public Discovery:** Responsive landing page, curated learning paths, and categorized course catalog.
- **Structured Curriculum:** Course overviews with prerequisites, outcomes, syllabus accordion, ordered modules, and lessons.
- **Rich Learning Experience:** Lesson player supporting permitted YouTube embeds/resources, transparent attribution, and completion tracking.
- **Interactive Assessments:** Multiple-choice quiz player with instant grading and score persistence.
- **Learner Dashboard:** Enrolled courses, resume-learning shortcuts, and completion progress.
- **Admin Content Management System (CMS):** Protected authoring tools for courses, modules, lessons, and quizzes without requiring codebase edits.
- **Robust Role-Based Authorization:** Strict backend enforcement of least-privilege access for `visitor`, `learner`, and `admin` roles.

---

## 2. Technology Architecture

AXIVON LEARN is organized as a modular, high-performance monorepo:

```
AXIVON-LEARN/
│
├── apps/
│   ├── web/                    # Frontend Application (React + Vite + TypeScript)
│   └── api/                    # Backend REST API Server (Node.js + Express + TypeScript)
│
├── packages/
│   ├── shared-types/           # Single source of truth for cross-stack TypeScript types
│   ├── shared-schemas/         # Shared validation rules and constants (Zod)
│   └── shared-config/          # Shared system configuration, constants, and pagination defaults
│
├── design/                     # UI/UX design tokens, user flows, wireframes, and handoff specs
├── docs/                       # Architecture, requirements, API specs, onboarding, and ADRs
├── scripts/                    # Automation, database seeders, and developer tooling
├── infrastructure/             # Docker, deployment configs, and environment runbooks
├── tests/                      # End-to-end integration test suites
└── .github/                    # GitHub Actions CI/CD workflows and issue templates
```

### Technology Stack:
| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | React 18 / 19 + Vite + TypeScript | Blazing-fast HMR, strict type safety, modular component hierarchy. |
| **Styling** | Vanilla CSS / Tailored Design System | Bespoke, premium design system without heavy framework baggage. |
| **Backend** | Node.js + Express + TypeScript | Lightweight, scalable REST API following `/api/v1` standards. |
| **Database** | MongoDB + Mongoose | Flexible document model matching course syllabus and progress structures. |
| **Authentication** | Secure Cookies / JWT + Argon2id/Bcrypt | Cryptographically sound authentication with role-based middleware. |
| **Testing** | Vitest + React Testing Library + Supertest | Rapid unit, component, and API endpoint verification. |

---

## 3. Team Structure & Responsibilities

Seven dedicated functional disciplines collaborate within this unified repository:

1. **UI/UX Design Team:** Owns user flows, Figma screens, design tokens, responsive specs, and handoff assets in `design/`.
2. **Frontend Development Team:** Owns React components, client routing, pages, state handling, and frontend tests in `apps/web/`.
3. **Backend Development Team:** Owns REST APIs, business logic, auth middleware, data schemas, and API tests in `apps/api/`.
4. **Full Stack Development Team:** Owns cross-stack contracts (`packages/*`), Admin CMS, and end-to-end user journeys.
5. **QA and Testing Team:** Owns test plans, regression suites, acceptance criteria validation in `tests/` and `docs/testing/`.
6. **DevOps and Deployment Team:** Owns CI/CD automation, environment hygiene (`.env.example`), and containerization in `infrastructure/` and `.github/`.
7. **Project Management & Documentation:** Owns requirements, sprint tracking, and architectural decision records in `docs/`.

For complete ownership details, consult [`docs/onboarding/team-ownership.md`](docs/onboarding/team-ownership.md).

---

## 4. Getting Started (Local Setup)

### Prerequisites:
- **Node.js:** `v22.x` (Standardized in [`.nvmrc`](.nvmrc))
- **npm:** `v10.x` or `v11.x`
- **Git**

### Installation:
1. Clone the repository and navigate to the root:
   ```bash
   git clone <repository-url>
   cd "project codebase"
   ```
2. Set up environment configuration:
   ```bash
   # Copy safe template to local .env
   cp .env.example .env
   ```
   *(Review `.env` and adjust local port/database variables if needed. NEVER commit `.env`.)*

3. Install monorepo dependencies:
   ```bash
   npm install
   ```

4. Run development servers:
   ```bash
   # Run frontend web app (http://localhost:5173)
   npm run dev:web

   # Run backend API server (http://localhost:5000)
   npm run dev:api
   ```

---

## 5. Branching & Contribution Rules

All team members must follow the Git standards detailed in [`CONTRIBUTING.md`](CONTRIBUTING.md):
- **Never push directly to `main` or `develop`.**
- Create scoped feature branches:
  - `feature/frontend-<feature>`
  - `feature/backend-<feature>`
  - `feature/fullstack-<feature>`
  - `feature/uiux-<feature>`
  - `fix/<issue-description>`
- All tasks must be assigned in [`docs/onboarding/development-workflow.md`](docs/onboarding/development-workflow.md) before coding begins.
- Pull Requests require passing CI checks and at least one peer approval.
- **Zero secrets in Git** — automated pre-commit/CI scans enforce this policy.

---

## 6. MVP Scope & Boundaries

### P0 (Must Ship in 1-Month MVP):
- Public Home page, Course Catalog, and Course Details.
- User registration, login, session persistence, and learner profile.
- Enrolled course tracking and lesson player with video embeds.
- Lesson completion toggles and calculated course progress percentage.
- Multiple-choice quiz attempts and score displays.
- Protected Admin CMS to create, edit, and publish courses, modules, lessons, and quizzes.
- Responsive mobile/desktop layouts with loading skeletons, empty states, and error handling.

### Out of Scope for Month-One MVP:
- Payment gateways and paid subscriptions.
- Livestreaming classes.
- AI tutors and automated personalized recommendation engines.
- Native mobile applications (PWA/responsive web prioritized).
- Public instructor marketplace and unrestricted social feeds.
- Arbitrary code execution sandbox.

---

## 7. Important Documentation Directory

| Document | Description |
| :--- | :--- |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Branching conventions, PR templates, and Git integration rules |
| [`SECURITY.md`](SECURITY.md) | Vulnerability disclosure policy and secret handling standards |
| [`design/README.md`](design/README.md) | Design tokens, Figma references, user flows, and UX specs |
| [`docs/onboarding/team-ownership.md`](docs/onboarding/team-ownership.md) | Matrix of ownership and cross-discipline handoff criteria |
| [`docs/onboarding/development-workflow.md`](docs/onboarding/development-workflow.md) | Task assignment schema, intern conflict prevention, active task board |
| [`docs/architecture/folder-ownership-map.md`](docs/architecture/folder-ownership-map.md) | Comprehensive folder-to-team responsibility mapping |

---

## 8. License

Proprietary and Confidential. Copyright © 2026 Axivon Technologies. All rights reserved. Refer to [`LICENSE`](LICENSE) for details.
