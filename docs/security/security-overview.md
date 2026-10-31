# Security Overview: AXIVON LEARN

**Title:** Platform Security Architecture & Governance  
**Purpose:** End-to-end security model, encryption standards, and threat mitigations.  
**Status:** Implemented  
**Owner:** Security Lead  
**Last Updated:** 2026-10-31  

---

## 1. Foundational Security Principles
1. **Zero Secrets in Git:** Strict `.gitignore` rules prevent accidental commits of `.env` files.
2. **Backend Enforcement:** Permissions are validated in Express middleware, never trusted from client flags alone.
3. **Password Security:** Salted hashes with `bcryptjs`.
4. **Answer Secrecy:** Quiz answers are evaluated server-side and never sent in question payloads.
