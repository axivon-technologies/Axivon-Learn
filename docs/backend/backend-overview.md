# Backend Overview: AXIVON LEARN

**Title:** Backend REST API Architecture & Overview  
**Purpose:** Architecture of the Node.js + Express + TypeScript service in `apps/api`.  
**Status:** Implemented  
**Owner:** Backend Lead Engineer  
**Last Updated:** 2026-10-31  

---

## 1. Technical Baseline
- **Runtime:** Node.js v22.17.1 LTS.
- **Framework:** Express 4.21+.
- **Language:** TypeScript 5.7+ with strict typing.
- **Database ODM:** Mongoose 8.9+.
- **Password Hashing:** `bcryptjs` (salt rounds: 10).
- **Authentication:** `jsonwebtoken` (JWT) + `cookie-parser`.
- **Validation:** Zod 3.24+.
- **Testing:** Vitest + Supertest.
