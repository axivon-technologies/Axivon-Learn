# Quiz Endpoints: AXIVON LEARN

**Title:** Quiz & Assessment API Endpoints  
**Purpose:** Assessment delivery and automated scoring endpoints.  
**Status:** Implemented  
**Owner:** API Lead Engineer  
**Last Updated:** 2026-10-31  

---

### 1. `GET /api/v1/quizzes/:quizId`
- **Purpose:** Returns quiz questions without answer keys.
- **Access:** Public / Learner
- **Response (200):** `{ "success": true, "data": { "quizId": "...", "questions": [...] } }`

### 2. `POST /api/v1/quizzes/:quizId/submit`
- **Purpose:** Evaluates submitted answers on the server and records score.
- **Access:** Authenticated Learner
- **Response (200):** `{ "success": true, "data": { "score": 3, "total": 3, "passed": true } }`
