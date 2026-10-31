# Application Structure: AXIVON LEARN

**Title:** Monorepo Layout & Module Boundaries  
**Purpose:** Details how code is organized across `apps/`, `packages/`, `design/`, and `docs/`.  
**Status:** Implemented  
**Owner:** Repository Architect  
**Last Updated:** 2026-10-31  

---

## 1. Directory Tree & Responsibilities

```text
AXIVON-LEARN/
├── apps/
│   ├── web/                     # Client application (Vite SPA)
│   │   ├── src/app/             # Root providers and App entry
│   │   ├── src/components/      # Reusable UI primitives (common, layout, feedback, forms)
│   │   ├── src/features/        # Domain-driven features (catalog, courses, lessons, quizzes, admin)
│   │   ├── src/routes/          # React Router v6 route configuration
│   │   └── src/styles/          # Design tokens & global CSS
│   └── api/                     # Backend REST API
│       ├── src/config/          # Environment variables & runtime constants
│       ├── src/database/        # Mongoose connection & document models
│       ├── src/middleware/      # Auth, authorization, error handler, validation
│       ├── src/app.ts           # Configured Express application
│       └── src/server.ts        # HTTP listener and graceful shutdown
├── packages/
│   ├── shared-types/            # TypeScript interfaces imported across apps
│   ├── shared-schemas/          # Shared Zod validation schemas
│   └── shared-config/           # Constants (ROLES, DEFAULT_PAGINATION)
├── design/                      # Design system guidelines, tokens, and handoff notes
├── docs/                        # Complete technical documentation in Markdown
└── tests/                       # Cross-stack end-to-end integration test suites
```

---

## 2. Cross-Workspace Dependency Graph

```
apps/web ───────► @axivon-learn/shared-types ◄─────── apps/api
apps/web ───────► @axivon-learn/shared-schemas ◄───── apps/api
apps/web ───────► @axivon-learn/shared-config ◄────── apps/api
```

Both `apps/web` and `apps/api` import from `packages/*` using npm workspace resolution (`*`). This ensures that client form validation and server payload validation always share identical constraints.
