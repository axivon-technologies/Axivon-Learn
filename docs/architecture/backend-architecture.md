# Backend Architecture: AXIVON LEARN

**Title:** REST API Architecture Specification  
**Purpose:** Details the Express server modular structure, middleware pipeline, authentication, and error propagation in `apps/api`.  
**Status:** Implemented  
**Owner:** Backend Lead Engineer  
**Last Updated:** 2026-10-31  

---

## 1. Architectural Principles

1. **Explicit Separation of Concerns:**
   - `app.ts`: Defines Express configuration, mounts middleware, and registers routes.
   - `server.ts`: Handles process startup, database connection binding, and graceful termination.
   - This allows unit and integration tests (via `supertest`) to test HTTP routes without binding active network ports.
2. **Deterministic Version Prefix:**
   - Every API endpoint is rooted under `/api/v1/`.
3. **Fail-Safe Tolerance:**
   - If the database is temporarily offline, the server logs a diagnostic notice and responds gracefully, preventing unhandled Node process crashes.

---

## 2. HTTP Middleware Pipeline

Every incoming request passes through an ordered sequence of middleware:

```
Request ──► CORS Whitelist (env.CORS_ORIGIN)
        ──► Body Parser (express.json())
        ──► Cookie Parser (cookieParser)
        ──► Structured Logger (requestLogger)
        ──► Request Validation (validate(zodSchema))
        ──► Authentication Middleware (authenticate) [if route protected]
        ──► Role Authorization (authorize(['admin'])) [if admin route]
        ──► Controller Handler / Database Query
        ──► Response Formatter / Centralized Error Handler (errorHandler)
```

---

## 3. Centralized Error Handling

All uncaught exceptions or business validation failures create an `AppError(message, statusCode, details)`:
```json
{
  "success": false,
  "error": {
    "message": "Request validation failed.",
    "statusCode": 400,
    "details": [
      { "field": "email", "message": "Invalid email address" }
    ]
  }
}
```
Stack traces and internal database connection strings are never leaked in response payloads.
