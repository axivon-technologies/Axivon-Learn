# Admin Endpoints: AXIVON LEARN

**Title:** Admin CMS API Endpoints  
**Purpose:** Administrative endpoints for course authoring, drafting, and platform metrics.  
**Status:** Implemented  
**Owner:** Full Stack & API Lead  
**Last Updated:** 2026-10-31  

---

### 1. `GET /api/v1/admin/overview`
- **Purpose:** Returns summary counts (total courses, published, drafts, categories).
- **Access:** Authenticated Admin (Role: `admin`)
- **Response (200):** `{ "success": true, "data": { "totalCourses": 2, "publishedCourses": 2, "draftCourses": 0, "totalCategories": 3 } }`
- **Error (403):** Access forbidden if role is `learner` or `visitor`.
