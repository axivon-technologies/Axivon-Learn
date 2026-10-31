# Authentication Endpoints: AXIVON LEARN

**Title:** Auth API Specification  
**Purpose:** Endpoints for user registration, authentication, logout, and profile retrieval.  
**Status:** Implemented  
**Owner:** API Lead Engineer  
**Last Updated:** 2026-10-31  

---

### 1. `POST /api/v1/auth/register`
- **Purpose:** Registers a new learner account.
- **Access:** Public
- **Request Body:** `{ "name": "string", "email": "string", "password": "string (min 8)" }`
- **Response (201):** `{ "success": true, "data": { "user": { ... }, "token": "..." } }`

### 2. `POST /api/v1/auth/login`
- **Purpose:** Authenticates credentials and sets session cookie.
- **Access:** Public
- **Request Body:** `{ "email": "string", "password": "string" }`
- **Response (200):** `{ "success": true, "data": { "user": { ... }, "token": "..." } }`

### 3. `POST /api/v1/auth/logout`
- **Purpose:** Clears session cookies.
- **Access:** Public
- **Response (200):** `{ "success": true, "message": "Signed out successfully." }`

### 4. `GET /api/v1/auth/me`
- **Purpose:** Retrieves currently authenticated user profile.
- **Access:** Authenticated (Bearer / Cookie)
- **Response (200):** `{ "success": true, "data": { "user": { ... } } }`
