# AXIVON LEARN — Backend REST API (`apps/api`)

**Organization:** Axivon Technologies  
**Department:** Backend Engineering (`apps/api/`)  
**Maintainer:** Vinay Partap (Backend Developer)  
**Runtime Stack:** Node.js v22 LTS · Express 4.21 · TypeScript 5.7 · Mongoose 8.9 · Zod 3.24 · Vitest + Supertest  

---

## 1. Overview & Modular Architecture

`apps/api` is the authoritative REST API service for **AXIVON LEARN**. It separates `src/app.ts` (Express pipeline and module mounting) from `src/server.ts` (database startup and graceful `SIGINT`/`SIGTERM` shutdown) and organizes all business logic across **12 domain modules** following the standard `routes -> controller -> service -> store/model -> validators` pattern:

```text
apps/api/
├── .env.example                 # Safe environment variable template (zero secrets)
├── BACKEND_AUDIT.md             # Honest PROPOSED / IMPLEMENTED / TESTED audit matrix
├── README.md                    # Setup, schema, seed, security, backup & rollback handover guide
├── openapi.json                 # Machine-readable OpenAPI 3.0.3 contract
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── src/
│   ├── app.ts                   # Express middleware & 12 mounted domain routers
│   ├── server.ts                # MongoDB connection & graceful shutdown
│   ├── config/
│   │   └── env.ts               # Zod startup env validation + production secret guards
│   ├── database/
│   │   ├── connection.ts        # Mongoose lifecycle helpers
│   │   ├── seed.ts              # 12-collection curriculum seed script (prod-guarded)
│   │   └── models/              # 12 Mongoose schemas & compound indexes
│   ├── docs/
│   │   └── openapi.ts           # OpenAPI 3.0.3 contract served at GET /api/v1/openapi.json
│   ├── middleware/              # authenticate, authorize, validate, sanitize, rateLimit, errorHandler, requestLogger
│   ├── modules/
│   │   ├── auth/                # Register, login, refresh rotation, logout, me, forgot/reset password
│   │   ├── users/               # Own profile read/update, change password, horizontal ownership guard
│   │   ├── categories/          # Active categories & published course counts
│   │   ├── courses/             # Published catalog filters, pagination & syllabus
│   │   ├── modules/             # Ordered course modules
│   │   ├── lessons/             # Free-preview vs enrolled lock checks & video embed rights fallback
│   │   ├── learning-paths/      # Published multi-course learning tracks
│   │   ├── projects/            # Published hands-on project briefs
│   │   ├── enrollments/         # Idempotent learner enrollments & nextLesson calculation
│   │   ├── progress/            # Lesson completion persistence & authoritative progressPercent sync
│   │   ├── quizzes/             # Pre-submit answer-key stripping, 5-attempt cap & server-side scoring
│   │   └── admin/               # Strict admin-only CMS CRUD & platform metrics
│   ├── shared/
│   │   └── response.ts          # Standardized API response envelope helper
│   └── utils/                   # Safe regex escaping & MongoDB ObjectId validation
└── tests/                       # 10 automated Vitest + Supertest integration test suites
```

---

## 2. Local Development Setup & Commands

From the monorepo root (`Axivon-Learn/`):

```bash
# 1. Install monorepo dependencies
npm install

# 2. Copy safe environment placeholders (never commit .env!)
cp .env.example .env

# 3. Seed local MongoDB (mongodb://localhost:27017/axivon_learn)
npm run seed --workspace=apps/api

# 4. Start backend API in watch mode (http://localhost:5000)
npm run dev:api
```

### Verification Commands

```bash
# TypeScript strict check (0 errors)
npm run typecheck --workspace=apps/api

# Production build to apps/api/dist/
npm run build:api

# Full Vitest + Supertest suite
npm run test:api
```

---

## 3. Environment Configuration & Production Hardening

`src/config/env.ts` validates configuration at startup via `validateEnv()` using **Zod**:

| Variable | Default (Dev/Test Only) | Production Requirement (`NODE_ENV=production`) |
| :--- | :--- | :--- |
| `NODE_ENV` | `development` | Must be `production` in live environments |
| `PORT` | `5000` | Valid TCP port (`1–65535`) |
| `API_PREFIX` | `/api/v1` | Must start with `/` |
| `CORS_ORIGIN` | `http://localhost:5173` | Explicit frontend origin (credentials enabled) |
| `MONGODB_URI` | `mongodb://localhost:27017/axivon_learn` | **Required** (least-privilege MongoDB URI) |
| `JWT_SECRET` | *(dev-only placeholder)* | **Required**, unique, minimum `32` characters |
| `REFRESH_TOKEN_SECRET` | *(dev-only placeholder)* | **Required**, unique, minimum `32` characters |
| `COOKIE_SECRET` | *(dev-only placeholder)* | **Required**, unique, minimum `16` characters |

> **Fail-Fast Guarantee:** If `NODE_ENV=production` is started with missing secrets or left on development defaults, `validateEnv()` immediately throws a startup configuration error before binding a port.

---

## 4. Database Models & Index Summary

| Model | Collection / Purpose | Enforced Indexes & Security Rules |
| :--- | :--- | :--- |
| `User` | Accounts & roles (`learner`, `admin`) | Unique `email`; `passwordHash` & reset token fields `select: false`; `isActive` index |
| `Category` | Curriculum taxonomy | Unique `slug`; `sortOrder` + `isActive` index |
| `Course` | Courses (`draft`, `published`, `archived`) | Unique `slug`; `status`, `category`, and `categoryId` indexes; `publishedAt` |
| `CourseModule` | Ordered course sections | Compound `{ courseId: 1, order: 1 }` |
| `Lesson` | Video/article/resource lessons | Unique `{ courseId: 1, slug: 1 }`; `{ moduleId: 1, order: 1 }`; `contentRightsStatus` |
| `Enrollment` | Learner-to-course join | Unique `{ userId: 1, courseId: 1 }` (prevents duplicate enrollments) |
| `LessonProgress` | Per-lesson completion tracking | Unique `{ userId: 1, lessonId: 1 }` (idempotent completion updates) |
| `Quiz` | Course/module assessments | `courseId` index; `passingScore`; `status` (`draft`/`published`) |
| `QuizQuestion` | Multiple-choice question items | `quizId` index; `correctOptionIndex` has `select: false` |
| `QuizAttempt` | Server-scored learner attempts | `userId` & `quizId` indexes; server-computed `score` & `passed` |
| `LearningPath` | Ordered multi-course tracks | Unique `slug`; ordered `courseIds` |
| `ProjectBrief` | Hands-on capstone briefs | Unique `slug`; skills, deliverables, `status` |

---

## 5. Seed Procedure & Content Rights

- Run `npm run seed --workspace=apps/api` to populate local MongoDB with active categories, 2 published courses (`ai-ml-foundations`, `full-stack-web-development`), 1 authoring draft course, ordered modules & lessons (both free-preview and enrolled-only), 3-question assessments, learning paths, and project briefs.
- **Production Guard:** `seed.ts` refuses to wipe data when `NODE_ENV=production` unless `ALLOW_DESTRUCTIVE_SEED=true` is explicitly set, and requires `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from environment variables rather than hard-coded credentials.
- **Video Rights Compliance:** Every lesson stores `sourceAttribution` and `contentRightsStatus` (`owned`, `permitted_embed`, `pending_review`). Lessons marked `pending_review` automatically withhold `videoEmbedId` and return a safe `fallbackNotice` + external `resourceLinks`.

---

## 6. API Contract & Response Envelope

- **Interactive / Machine Contract:** Served live at `GET /api/v1/openapi.json` and checked into `apps/api/openapi.json` (OpenAPI `3.0.3`).
- **Human-Readable Reference:** Maintained in `docs/api/*.md`.
- **Standard Envelope:**
  - Success: `{ "success": true, "data": <payload>, "error": null, "meta"?: <pagination> }`
  - Error: `{ "success": false, "data": null, "error": { "code": "<ERROR_CODE>", "message": "<safe message>", "statusCode": <httpCode>, "details"?: <validationIssues> } }`

---

## 7. Backup, Restore & Rollback Runbook (Handover Notes)

### MongoDB Backup & Restore Verification
```bash
# Create compressed timestamped backup archive
mongodump --uri="$MONGODB_URI" --archive="axivon_backup_$(date +%Y%m%d_%H%M%S).gz" --gzip

# Test restore into an isolated verification database before production use
mongorestore --uri="mongodb://localhost:27017" \
  --nsFrom="axivon_learn.*" --nsTo="axivon_learn_restore_check.*" \
  --archive="axivon_backup_<timestamp>.gz" --gzip --drop
```

### Deployment Rollback Procedure
1. **Health Verification:** Monitor `GET /api/v1/health` (`status: "healthy"`, `database: "connected"`).
2. **Application Rollback:** All Phase 1 schema additions are backward-compatible document fields/indexes. If a release exhibits elevated `5xx` rates, redeploy the previous tagged container/commit artifact immediately and restart the Node process (`SIGTERM` triggers clean Mongoose drain in `src/server.ts`).
3. **Data Rollback (Last Resort):** Restore the pre-release `mongodump` archive after placing the API in maintenance mode.

---

## 8. Known MVP Limitations & Deferred Post-MVP Scope

Per *Backend Implementation Specification v1.0 (Section 2 & Section 14)*, the following items are intentionally out of Phase 1 MVP scope or documented as known architectural trade-offs:

1. **In-Memory Rate Limiter Window (`src/middleware/rateLimit.ts`):** Rate-limit counters are stored per Node.js process in Phase 1. Horizontal multi-instance production deployments should back rate limiting with shared Redis storage.
2. **Password Reset Delivery (`POST /api/v1/auth/forgot-password`):** Generates cryptographically hashed one-time reset tokens (`SHA-256`, 30-minute TTL) in MongoDB; transactional SMTP email dispatch is deferred until company mail credentials are provisioned by DevOps.
3. **Stateless Refresh Rotation:** Access and refresh JWTs validate active account status (`isActive`) on refresh and authenticated requests; full per-device refresh-token revocation tables are deferred to Phase 2.
4. **Deferred Non-MVP Features:** Payment gateways, live cohort video streaming, AI tutor chat, code execution sandboxes, and community forums are excluded per MVP charter.
