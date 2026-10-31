# Data Models: AXIVON LEARN

**Title:** Document Data Models & Schemas  
**Purpose:** Formal schema definition for all Mongoose models.  
**Status:** Implemented  
**Owner:** Database Engineer  
**Last Updated:** 2026-10-31  

---

## 1. Core Model Schemas
All models are defined in `apps/api/src/database/models/`:
- **`User`**: `name`, `email` (unique index), `passwordHash` (select: false), `role` (`visitor`|`learner`|`admin`), `isActive`.
- **`Course`**: `title`, `slug` (unique index), `summary`, `category`, `level`, `status` (`draft`|`published`|`archived`), `outcomes`, `prerequisites`, `estimatedDurationHours`.
- **`Lesson`**: `courseId`, `moduleId`, `title`, `slug`, `videoUrl`, `sourceAttribution`, `durationMinutes`, `order`, `isFreePreview`.
- **`Enrollment`**: `userId`, `courseId`, `completedLessons` (`ObjectId[]`), `progressPercent`, compound unique index on `(userId, courseId)`.
- **`QuizQuestion`**: `quizId`, `prompt`, `options` (`string[]`), `correctOptionIndex` (select: false), `explanation`.
