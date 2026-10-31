# Non-Functional Requirements: AXIVON LEARN

**Title:** Non-Functional Requirements (NFR) Specification  
**Purpose:** Technical constraints, performance criteria, security baselines, and reliability expectations.  
**Status:** Approved Requirements  
**Owner:** Senior Software Architect & DevOps Lead  
**Last Updated:** 2026-10-31  

---

## 1. Performance & Latency (NFR-PERF)

* **NFR-PERF-01 (API Response):** 95th percentile response times for catalog and course queries (`/api/v1/courses`) must remain under 150ms under normal load.
* **NFR-PERF-02 (Bundle Size):** Production client bundle for `apps/web` must remain under 250KB gzipped for initial entry chunks.
* **NFR-PERF-03 (Health Check):** `/api/v1/health` must respond within 50ms, performing a non-blocking check on database readiness.

---

## 2. Security & Data Protection (NFR-SEC)

* **NFR-SEC-01 (Zero Secrets):** Under no circumstances may credentials, database URIs with passwords, or encryption keys be committed to Git.
* **NFR-SEC-02 (Cookie Hygiene):** Authentication cookies must have `HttpOnly` and `SameSite=Lax` (or `Strict`) flags set, with `Secure` enabled in production.
* **NFR-SEC-03 (Input Validation):** All incoming HTTP request parameters, query strings, and payloads must be validated using Zod schemas before reaching business logic.
* **NFR-SEC-04 (Safe Logging):** Passwords, JWT secrets, and personal identifiable information must be stripped from all console and operational log files.

---

## 3. Reliability & Maintainability (NFR-REL)

* **NFR-REL-01 (Graceful Shutdown):** The API server must intercept `SIGINT` and `SIGTERM`, terminate open HTTP connections gracefully, and close database connection pools within 10 seconds.
* **NFR-REL-02 (Database Tolerance):** If the MongoDB server is temporarily unreachable, the API must return a structured 503/error or run in offline-safe mode without crashing the process.
* **NFR-REL-03 (Modularity):** The monorepo architecture must enforce clean boundaries between `apps/web`, `apps/api`, and `packages/*`.

---

## 4. Usability & Accessibility (NFR-A11Y)

* **NFR-A11Y-01 (Contrast Ratio):** All text elements must achieve a contrast ratio of at least 4.5:1 against their backgrounds (WCAG 2.1 AA).
* **NFR-A11Y-02 (Keyboard Navigability):** All interactive buttons, links, and form fields must be operable using keyboard navigation alone, featuring visible focus indicators.
* **NFR-A11Y-03 (Responsive Layout):** The interface must display without horizontal scrollbars across screen widths ranging from 320px to 2560px.
