# Frontend Overview: AXIVON LEARN

**Title:** Frontend Application Architecture & Developer Overview  
**Purpose:** Architecture overview of the React + Vite + TypeScript application in `apps/web`.  
**Status:** Implemented  
**Owner:** Frontend Lead Engineer  
**Last Updated:** 2026-10-31  

---

## 1. Technical Stack

- **Framework:** React 18 / 19 (Strict Mode enabled).
- **Bundler & Dev Server:** Vite 6 (Port: 5173).
- **Language:** TypeScript 5.7+ (Strict type-checking enabled).
- **Routing:** React Router DOM v6 with nested layout routes.
- **Server State Management:** TanStack React Query v5.
- **Styling:** Bespoke Vanilla CSS design tokens (`apps/web/src/styles/index.css`).
- **Testing:** Vitest + React Testing Library + jsdom.

---

## 2. Core Architectural Philosophy

1. **Feature-First Organization:** Business code lives in `apps/web/src/features/` organized by product domain (`catalog`, `courses`, `lessons`, `quizzes`, `progress`, `auth`, `admin`).
2. **Layout Decoupling:** Reusable layout wrappers (`PublicLayout`, `AuthLayout`, `LearnerLayout`, `AdminLayout`) separate global navigation, shell bars, and footers from screen content.
3. **No Contract Invention:** Frontend engineers must consume types from `@axivon-learn/shared-types` rather than inventing client-side response shapes.
