# Backend Folder Structure: AXIVON LEARN

**Title:** Backend Directory Layout  
**Purpose:** Explanation of modules, middleware, database, and test folders in `apps/api`.  
**Status:** Implemented  
**Owner:** Backend Lead Engineer  
**Last Updated:** 2026-10-31  

---

## 1. Directory Tree
```text
apps/api/src/
├── config/            # env.ts (typed environment variables)
├── database/          # connection.ts, seed.ts, models/ (Mongoose schemas)
├── middleware/        # errorHandler.ts, requestLogger.ts, authenticate.ts, authorize.ts, validate.ts
├── modules/           # Domain business logic (auth, courses, quizzes, admin)
├── app.ts             # Express application and route definitions
└── server.ts          # Server listener, DB bootstrap, graceful shutdown
```
