# Integration Guide: AXIVON LEARN

**Title:** Cross-Stack Integration & Developer Interface Guide  
**Purpose:** Instructions for integrating client features with backend endpoints without contract drift.  
**Status:** Implemented  
**Owner:** Senior Full Stack Architect  
**Last Updated:** 2026-10-31  

---

## 1. Single Source of Truth: `@axivon-learn/shared-types`

Frontend and backend developers must not define independent, competing TypeScript interfaces for the same domain entity.

When implementing or consuming an endpoint:
1. Check `packages/shared-types/src/index.ts` for the existing contract (`UserProfile`, `CourseSummary`, `QuizAttemptResult`).
2. If a new field or entity is required:
   - Propose the change to `packages/shared-types/src/index.ts`.
   - Submit a pull request tagged with the relevant Task ID.
   - Once approved, update the Mongoose model in `apps/api` and the React component in `apps/web`.

---

## 2. API Proxy in Local Development

During local development, Vite proxies all requests starting with `/api` to the local Express server:
```typescript
// apps/web/vite.config.ts
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true
    }
  }
}
```
This enables frontend code to call `fetch('/api/v1/courses')` without CORS configuration headaches during development.

---

## 3. Standard Response Envelope

All API endpoints return responses in one of two deterministic envelopes:

### Success Response:
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response:
```json
{
  "success": false,
  "error": {
    "message": "Human-readable error description",
    "statusCode": 400,
    "details": [ ... ]
  }
}
```
Client services must check `res.ok` or `data.success` and bind error states directly to UI `<ErrorState />` banners.
