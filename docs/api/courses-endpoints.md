# Courses Endpoints: AXIVON LEARN

**Title:** Course Catalog API Endpoints  
**Purpose:** Public discovery and syllabus retrieval endpoints.  
**Status:** Implemented  
**Owner:** API Lead Engineer  
**Last Updated:** 2026-10-31  

---

### 1. `GET /api/v1/courses`
- **Purpose:** Lists published courses with optional `?category=` filtering.
- **Access:** Public
- **Response (200):** `{ "success": true, "data": [ { "id": "...", "title": "...", "slug": "...", "summary": "...", "category": "..." } ] }`

### 2. `GET /api/v1/courses/:slug`
- **Purpose:** Retrieves full course details and nested syllabus modules/lessons.
- **Access:** Public
- **Response (200):** `{ "success": true, "data": { "title": "...", "outcomes": [...], "modules": [...] } }`
- **Error (404):** Course not found or in draft state.
