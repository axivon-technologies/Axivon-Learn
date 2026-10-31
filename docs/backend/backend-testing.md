# Backend Testing: AXIVON LEARN

**Title:** Backend Automated Testing Guide  
**Purpose:** Documentation of Supertest API tests and Vitest test runners.  
**Status:** Implemented & Passing (3/3 test suites green)  
**Owner:** QA Lead & Backend Lead  
**Last Updated:** 2026-10-31  

---

## 1. Running Tests
```bash
npm run test:api
```
Includes:
- `health.test.ts`: Verifies `/api/v1/health` responds with status `healthy` and leaks zero secrets.
- `not-found.test.ts`: Verifies undefined routes return structured 404 errors.
- `validation.test.ts`: Verifies malformed registrations return structured 400 errors.
