# Database Overview: AXIVON LEARN

**Title:** Database Architecture & Technology Selection  
**Purpose:** Comprehensive overview of MongoDB and Mongoose document modeling.  
**Status:** Configured  
**Owner:** Database Engineer / Senior Architect  
**Last Updated:** 2026-10-31  

---

## 1. Technology Selection: MongoDB & Mongoose
MongoDB was selected as the single primary persistence store because syllabus hierarchies (Courses containing ordered Modules, which contain ordered Lessons) map directly to nested document structures.

## 2. Collections
- `users`: User profiles, role badges, hashed credentials.
- `categories`: Course taxonomy categories.
- `courses`: Published and draft course catalog metadata.
- `coursemodules`: Syllabus module hierarchy.
- `lessons`: Lesson descriptions, video embed URLs, source attributions.
- `enrollments`: Enrolled courses, completed lesson IDs, progress percentage.
- `quizzes`: Lesson-linked assessments.
- `quizquestions`: Multiple-choice questions (answers hidden from public queries).
- `quizattempts`: Learner quiz scores and timestamps.
- `learningpaths`: Curated multi-course learning tracks.
- `projectbriefs`: Practical project deliverables.
