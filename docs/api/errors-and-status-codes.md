# Errors & Status Codes: AXIVON LEARN

**Title:** Standard HTTP Error Codes  
**Purpose:** Inventory of error codes and response formats returned by `/api/v1`.  
**Status:** Implemented  
**Owner:** API Lead Engineer  
**Last Updated:** 2026-10-31  

---

| HTTP Code | Name | Scenario |
| :---: | :--- | :--- |
| `200` | OK | Successful query or mutation. |
| `201` | Created | Successful user registration or course creation. |
| `400` | Bad Request | Validation failure on request body, params, or query. |
| `401` | Unauthorized | Missing or expired authentication token. |
| `403` | Forbidden | Insufficient permissions (e.g. learner accessing admin endpoint). |
| `404` | Not Found | Route, course slug, or quiz ID does not exist. |
| `500` | Internal Error | Unhandled server error. |
