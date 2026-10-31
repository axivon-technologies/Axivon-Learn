# Database Relationships: AXIVON LEARN

**Title:** Document References & Entity Relationships  
**Purpose:** Defines which data is embedded vs. referenced via ObjectId.  
**Status:** Implemented  
**Owner:** Database Engineer  
**Last Updated:** 2026-10-31  

---

## 1. Relationship Model
- **Course → CourseModule:** 1-to-Many via `CourseModule.courseId` reference.
- **CourseModule → Lesson:** 1-to-Many via `Lesson.moduleId` reference.
- **Lesson → Quiz:** 1-to-1 via `Quiz.lessonId` reference.
- **Quiz → QuizQuestion:** 1-to-Many via `QuizQuestion.quizId` reference.
- **User + Course → Enrollment:** Many-to-Many junction document tracking array of completed lesson ObjectIds.
