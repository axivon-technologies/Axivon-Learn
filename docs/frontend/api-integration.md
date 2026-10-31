# API Integration: AXIVON LEARN

**Title:** Frontend API Integration & Proxy Guide  
**Purpose:** Instructions for consuming `/api/v1` backend endpoints.  
**Status:** Implemented  
**Owner:** Full Stack & Frontend Teams  
**Last Updated:** 2026-10-31  

---

## 1. Vite Proxy Configuration
Vite proxies all calls starting with `/api` to the backend server running at `http://localhost:5000`:
```typescript
fetch('/api/v1/courses')
```
Responses return a standard envelope: `{ success: true, data: [...] }`.
