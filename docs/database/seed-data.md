# Database Seed Data: AXIVON LEARN

**Title:** Development Seed Procedure & Initial Fixtures  
**Purpose:** Instructions for populating the database with launch curriculum.  
**Status:** Implemented (`apps/api/src/database/seed.ts`)  
**Owner:** Full Stack & Database Teams  
**Last Updated:** 2026-10-31  

---

## 1. Running the Seeder
```bash
npm run seed
```
Seeds:
- 2 Users: `admin@axivon.local` and `learner@axivon.local`.
- 3 Categories: `AI & Machine Learning`, `Web Development`, `Cloud & DevOps`.
- 2 Courses with modules, lessons, and quizzes.
- 2 Curated Learning Paths.
