# Backend Module Design: AXIVON LEARN

**Title:** Domain Module Design & Boundaries  
**Purpose:** Explains domain modularity across Auth, Courses, Enrollments, Quizzes, and Admin.  
**Status:** Implemented  
**Owner:** Backend Lead Engineer  
**Last Updated:** 2026-10-31  

---

## 1. Core Modules
- **Auth:** Registration, login, JWT token issuance, cookie handling.
- **Courses:** Catalog discovery, syllabus module hierarchy, slug resolution.
- **Enrollments & Progress:** Tracking completed lesson IDs and progress percentages.
- **Quizzes:** Secret answer key protection and automated scoring.
- **Admin:** Course CRUD, category management, and overview metrics.
