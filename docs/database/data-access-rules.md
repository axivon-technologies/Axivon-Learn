# Data Access Rules: AXIVON LEARN

**Title:** Data Privacy & Query Access Controls  
**Purpose:** Rules governing query projection, secret stripping, and ownership checks.  
**Status:** Implemented  
**Owner:** Security Lead & Database Engineer  
**Last Updated:** 2026-10-31  

---

## 1. Non-Negotiable Query Rules
1. Password hashes must never be queried or returned in public API payloads (`select: false`).
2. Correct quiz answers must never be projected in public quiz queries.
3. Enrollment queries must filter strictly by `userId: req.user.id`.
