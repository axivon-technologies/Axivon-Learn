# Backup & Restore: AXIVON LEARN

**Title:** Database Backup & Recovery Runbook  
**Purpose:** Operational backup and restore procedures for MongoDB.  
**Status:** Proposed Operations  
**Owner:** DevOps & Database Lead  
**Last Updated:** 2026-10-31  

---

## 1. Standard mongodump & mongorestore
```bash
# Backup
mongodump --uri="mongodb://localhost:27017/axivon_learn" --out=/backup/$(date +%F)

# Restore
mongorestore --uri="mongodb://localhost:27017/axivon_learn" /backup/2026-10-31/axivon_learn
```
