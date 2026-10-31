# System Architecture Overview: AXIVON LEARN

**Title:** High-Level System Architecture & Component Model  
**Purpose:** Comprehensive overview of the distributed components, boundaries, and runtime environments of AXIVON LEARN.  
**Status:** Implemented  
**Owner:** Senior Full Stack Architect  
**Last Updated:** 2026-10-31  

---

## 1. Architectural Style: Modular Monolith

AXIVON LEARN is engineered as a **Modular Monolith** organized in a single monorepo. This eliminates the operational overhead of microservices while strictly decoupling domain boundaries into independent code modules.

```
┌────────────────────────────────────────────────────────┐
│                   CLIENT BROWSER                       │
│    Learner / Visitor / Administrator Web Session       │
└───────────────────────────┬────────────────────────────┘
                            │ (HTTPS / JSON / Cookies)
                            ▼
┌────────────────────────────────────────────────────────┐
│             FRONTEND APPLICATION (apps/web)            │
│       React 18 + Vite SPA + React Router + CSS Tokens  │
└───────────────────────────┬────────────────────────────┘
                            │ (REST API: /api/v1)
                            ▼
┌────────────────────────────────────────────────────────┐
│            BACKEND REST API (apps/api)                 │
│      Node.js + Express + Middleware + Domain Modules   │
└───────────────────────────┬────────────────────────────┘
                            │ (Mongoose ODM)
                            ▼
┌────────────────────────────────────────────────────────┐
│               DATABASE PERSISTENCE                     │
│         MongoDB 7.0+ (Local / Managed Atlas)           │
└────────────────────────────────────────────────────────┘
```

---

## 2. Component Breakdown

### 2.1 Web Application (`apps/web`)
* **Framework:** React 18 / 19 with Vite 6.
* **Routing:** React Router v6 using declarative layout hierarchies (`PublicLayout`, `AuthLayout`, `LearnerLayout`, `AdminLayout`).
* **Design System:** Bespoke Vanilla CSS design system using CSS variables, custom utility tokens, and high-contrast dark aesthetic.
* **Server State:** TanStack React Query configured with graceful retry policies.

### 2.2 API Server (`apps/api`)
* **Framework:** Node.js 22 LTS with Express 4.
* **Architecture:** Modular domain structure (`auth`, `courses`, `enrollments`, `quizzes`, `admin`).
* **Middleware Pipeline:** CORS whitelist → Request logger → Body parser → Cookie parser → Authentication → Authorization → Route handler → Centralized Error Handler.
* **Reliability:** Decoupled application instance (`app.ts`) and HTTP server runner (`server.ts`) for testability; graceful shutdown on `SIGTERM`.

### 2.3 Shared Packages (`packages/*`)
* **`shared-types`:** Cross-stack TypeScript interfaces (`UserProfile`, `CourseSummary`, `QuizAttemptResult`).
* **`shared-schemas`:** Shared Zod validation constraints.
* **`shared-config`:** Platform constants, default ports, and pagination parameters.
