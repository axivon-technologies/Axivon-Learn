# Backend Authorization: AXIVON LEARN

**Title:** Role-Based Access Control Middleware  
**Purpose:** Explains role evaluation for `visitor`, `learner`, and `admin`.  
**Status:** Implemented  
**Owner:** Backend Lead Engineer  
**Last Updated:** 2026-10-31  

---

## 1. Role Enforcement
The `authorize` middleware blocks unauthorized users with an HTTP 403 Forbidden status:
```typescript
app.get('/api/v1/admin/overview', authenticate, authorize(['admin']), handler);
```
