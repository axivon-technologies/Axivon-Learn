# Testing Strategy: AXIVON LEARN

**Title:** Quality Assurance & Testing Strategy  
**Purpose:** Test pyramid, tooling standards, and CI integration.  
**Status:** Implemented & Verified  
**Owner:** QA Lead  
**Last Updated:** 2026-10-31  

---

## 1. Test Pyramid
- **Unit & Component Tests:** Vitest + React Testing Library (runs in < 10s).
- **API Endpoint Tests:** Vitest + Supertest verifying status codes, envelopes, and error handling.
- **End-to-End Tests:** Validates complete user journeys from login to quiz submission.
