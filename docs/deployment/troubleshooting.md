# Deployment Troubleshooting: AXIVON LEARN

**Title:** Common Deployment & Runtime Errors  
**Purpose:** Diagnostic resolutions for port collisions, database timeouts, and proxy issues.  
**Status:** Implemented  
**Owner:** DevOps Lead  
**Last Updated:** 2026-10-31  

---

1. **Port 5000 in use:** Modify `PORT=5001` in `.env`.
2. **MongoDB Connection Warning:** The API runs in offline-tolerant mode if MongoDB is not running locally.
