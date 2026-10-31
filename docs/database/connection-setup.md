# Database Connection Setup: AXIVON LEARN

**Title:** Database Connection Lifecycle & Configuration  
**Purpose:** Local and cloud MongoDB setup runbook and troubleshooting steps.  
**Status:** Implemented  
**Owner:** Database Engineer & DevOps Lead  
**Last Updated:** 2026-10-31  

---

## 1. Environment Variable
```bash
MONGODB_URI=mongodb://localhost:27017/axivon_learn
```

## 2. Connection Lifecycle
`apps/api/src/database/connection.ts` manages connection initialization with a 3-second timeout:
- If MongoDB is available, connection succeeds and logs status.
- If MongoDB is unavailable (e.g., during offline development or initial CI steps), the system catches the error, logs a clean diagnostic notice, and runs in safe fallback mode.
