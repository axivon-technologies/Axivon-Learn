# User Flows: AXIVON LEARN

**Title:** UX User Flow Architecture  
**Purpose:** End-to-end screen transitions and user decision trees.  
**Status:** Approved Requirements  
**Owner:** UI/UX Lead Designer  
**Last Updated:** 2026-10-31  

---

## 1. Flow A: Visitor Discovery to Learner Enrollment

```
[Home Page /]
      │
      ├─────► [Browse Featured Paths] ──────► [/learning-paths]
      │
      └─────► [Click "Explore Courses"] ───► [/courses (Catalog)]
                                                    │
                                                    ▼
                                            [/courses/:slug]
                                                    │
                                                    ▼
                                            [Click "Enroll Now"]
                                                    │
                                                    ├─► If Authenticated: Direct Enrollment -> /dashboard
                                                    └─► If Unauthenticated: Redirect to /login
```

---

## 2. Flow B: Lesson Consumption & Quiz Verification

```
[/dashboard] ──► [Click "Resume Lesson"] ──► [/learn/:courseSlug/:lessonId]
                                                    │
                                                    ├─► Watch Video / Read Notes
                                                    ├─► Click "Mark as Complete" (Updates DB)
                                                    │
                                                    ▼
                                            [Click "Take Quiz"]
                                                    │
                                                    ▼
                                            [/quiz/:quizId]
                                                    │
                                                    ├─► Select Options
                                                    ├─► Click "Submit Assessment"
                                                    │
                                                    ▼
                                            [Score Evaluated on Server]
                                                    │
                                                    ├─► Pass: Return to /dashboard (Updated Progress)
                                                    └─► Fail: Option to Retake Quiz
```

---

## 3. Flow C: Admin Authoring & Publication Lifecycle

```
[/admin] ──► [/admin/courses] ──► [Click "+ Add New Course"]
                                          │
                                          ▼
                                [/admin/courses/new]
                                          │
                                          ├─► Input Title, Slug, Outcomes, Category
                                          ├─► Set Status = "draft"
                                          ├─► Click "Save Course Metadata"
                                          │
                                          ▼
                                [Course Created in DB]
                                          │
                                          ▼
                                [Update Status to "published"]
                                          │
                                          ▼
                                [Immediately Visible in Public Catalog /courses]
```
