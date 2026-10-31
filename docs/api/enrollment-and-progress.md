# Enrollment & Progress Endpoints: AXIVON LEARN

**Title:** Enrollment and Progress API Endpoints  
**Purpose:** Endpoints for managing learner enrollments and lesson completions.  
**Status:** Implemented  
**Owner:** API Lead Engineer  
**Last Updated:** 2026-10-31  

---

### 1. `GET /api/v1/enrollments`
- **Purpose:** Returns list of courses enrolled by the authenticated user.
- **Access:** Authenticated Learner
- **Response (200):** `{ "success": true, "data": [ ... ] }`
