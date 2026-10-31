# State Management: AXIVON LEARN

**Title:** Frontend State Management Architecture  
**Purpose:** Details local UI state vs server state caching with TanStack Query.  
**Status:** Implemented  
**Owner:** Frontend Lead Engineer  
**Last Updated:** 2026-10-31  

---

## 1. Local State vs Server State
- **Local UI State (`useState` / `useReducer`):** Accordion open/close, mobile navigation drawer toggle, quiz radio selection, tab navigation.
- **Server State (TanStack React Query):** Remote catalog items, user session records, syllabus trees, quiz submissions. Configured in `apps/web/src/app/App.tsx`.
