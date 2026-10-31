# Frontend Setup Guide: AXIVON LEARN

**Title:** Frontend Local Environment & Setup Guide  
**Purpose:** Step-by-step setup instructions for frontend engineers working in `apps/web`.  
**Status:** Implemented & Verified  
**Owner:** Frontend Lead Engineer  
**Last Updated:** 2026-10-31  

---

## 1. Prerequisites
- **Node.js:** v22.17.1 (as declared in `.nvmrc`)
- **npm:** 11.19.0+

## 2. Installation & Execution
```bash
# From workspace root
npm install

# Run frontend development server
npm run dev:web
```
The application will launch on `http://localhost:5173`.

## 3. Available Frontend Scripts
- `npm run dev --workspace=apps/web`: Starts the Vite dev server with hot module replacement (HMR).
- `npm run build --workspace=apps/web`: Type-checks and creates production bundle in `dist/`.
- `npm run test --workspace=apps/web`: Executes unit and component tests with Vitest.
