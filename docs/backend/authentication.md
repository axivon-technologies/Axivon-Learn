# Backend Authentication: AXIVON LEARN

**Title:** Backend Authentication Mechanics  
**Purpose:** Technical documentation of password hashing, token generation, and cookie management.  
**Status:** Implemented  
**Owner:** Backend Lead & Security Lead  
**Last Updated:** 2026-10-31  

---

## 1. Password Hashing
Passwords are salted and hashed using `bcryptjs` with 10 salt rounds:
```typescript
const salt = await bcrypt.genSalt(10);
const passwordHash = await bcrypt.hash(password, salt);
```
Plaintext passwords are never stored. In Mongoose, `passwordHash` is configured with `select: false` so queries never include hashes by default.
