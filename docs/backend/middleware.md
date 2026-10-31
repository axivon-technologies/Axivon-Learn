# Middleware Architecture: AXIVON LEARN

**Title:** Backend Express Middleware Pipeline  
**Purpose:** Explains request logging, error handling, CORS, and auth middleware.  
**Status:** Implemented  
**Owner:** Backend Lead Engineer  
**Last Updated:** 2026-10-31  

---

## 1. Active Middleware
1. **`cors`**: Whitelists frontend origin (`env.CORS_ORIGIN`) with `credentials: true`.
2. **`requestLogger`**: Logs method, URL, status code, and latency in ms.
3. **`validate(schema)`**: Validates request body using Zod and returns 400 with field issues.
4. **`authenticate`**: Verifies Bearer token or `access_token` cookie and populates `req.user`.
5. **`authorize(roles)`**: Verifies `req.user.role` matches allowed roles (e.g. `admin`).
6. **`errorHandler`**: Catches unhandled errors and returns structured JSON responses.
