# API Overview: AXIVON LEARN

**Title:** REST API Specification & Standards  
**Purpose:** Master API contract, conventions, and status codes.  
**Status:** Implemented  
**Owner:** API Lead Engineer  
**Last Updated:** 2026-10-31  

---

## 1. Core Conventions
- Base prefix: `/api/v1`
- Content-Type: `application/json`
- Authentication: `Authorization: Bearer <token>` or HTTP-only `access_token` cookie.
- Response Envelope: `{ "success": true, "data": ... }`
