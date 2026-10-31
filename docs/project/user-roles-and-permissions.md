# User Roles & Permissions: AXIVON LEARN

**Title:** Role-Based Access Control (RBAC) Specification  
**Purpose:** Formal definition of platform roles, permissions, security constraints, and forbidden actions.  
**Status:** Approved Requirements & Implemented  
**Owner:** Backend Lead & Security Officer  
**Last Updated:** 2026-10-31  

---

## 1. Supported Platform Roles (MVP)

The month-one MVP supports exactly three roles. Future roles (such as Instructor, Creator, or Moderator) are intentionally deferred to avoid premature complexity.

```
[VISITOR] ─────────► [LEARNER] ─────────► [ADMIN]
(Public Access)      (Authenticated)      (Full CMS Control)
```

---

## 2. Permissions Matrix

| Capability / Resource | Visitor | Learner | Admin |
| :--- | :---: | :---: | :---: |
| Browse Public Home (`/`) | Allowed | Allowed | Allowed |
| View Course Catalog (`/courses`) | Allowed | Allowed | Allowed |
| View Published Course Details (`/courses/:slug`) | Allowed | Allowed | Allowed |
| View Draft / Unpublished Courses | **Forbidden** | **Forbidden** | Allowed |
| Register Account / Authenticate (`/login`) | Allowed | Allowed | Allowed |
| View Personal Dashboard (`/dashboard`) | Redirect to Login | Allowed | Allowed |
| Mark Lesson Complete | **Forbidden** | Allowed (Own records only) | Allowed |
| Attempt Quiz & View Own Score | **Forbidden** | Allowed | Allowed |
| View Another Learner's Records | **Forbidden** | **Forbidden** | Allowed (Auditing) |
| Access Admin Panel (`/admin/*`) | **403 Forbidden** | **403 Forbidden** | Allowed |
| Create / Edit Courses | **403 Forbidden** | **403 Forbidden** | Allowed |
| Create / Edit Quizzes & Answers | **403 Forbidden** | **403 Forbidden** | Allowed |

---

## 3. Strict Security Rules

1. **Backend Enforcement:** Hiding an Admin navigation link in the client is **NOT** authorization. The backend middleware (`apps/api/src/middleware/authorize.ts`) evaluates every protected request.
2. **Horizontal Privilege Separation:** A learner cannot mutate another learner's enrollment or progress records. Requests must match `req.user.id` or fail with 403 Forbidden.
3. **Quiz Answer Secrecy:** Correct answers (`correctOptionIndex`) are never exposed in public quiz metadata payloads. Grading occurs exclusively on the backend API.
