# Validation & Errors: AXIVON LEARN

**Title:** Request Validation & Error Standards  
**Purpose:** Standards for Zod schema validation and error responses.  
**Status:** Implemented & Tested  
**Owner:** Backend Lead Engineer  
**Last Updated:** 2026-10-31  

---

## 1. Standard Error Format
```json
{
  "success": false,
  "error": {
    "message": "Request validation failed.",
    "statusCode": 400,
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```
