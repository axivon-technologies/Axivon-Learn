# Indexes & Constraints: AXIVON LEARN

**Title:** Database Indexes & Unique Constraints  
**Purpose:** Index inventory ensuring high query performance and data integrity.  
**Status:** Implemented  
**Owner:** Database Engineer  
**Last Updated:** 2026-10-31  

---

## 1. Indexes Defined
- `User.email`: Unique index (fast login lookups, prevents duplicate emails).
- `Course.slug`: Unique index (fast URL resolution).
- `Course.status`: Index (fast public catalog filtering for `status === "published"`).
- `Enrollment.(userId, courseId)`: Compound unique index (prevents duplicate enrollments).
- `Lesson.(moduleId, order)`: Compound index for ordered syllabus playback.
