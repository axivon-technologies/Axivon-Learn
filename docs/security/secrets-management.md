# Secrets Management: AXIVON LEARN

**Title:** Secrets & Environment Hygiene Guide  
**Purpose:** Instructions for handling local and production secrets safely.  
**Status:** Implemented  
**Owner:** DevOps & Security Lead  
**Last Updated:** 2026-10-31  

---

## 1. Rules
- Never commit `.env` to Git.
- Always maintain `.env.example` with descriptive, safe placeholders.
- If a secret is leaked, rotate the key immediately on the external host and purge Git history.
