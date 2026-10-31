# Data Flow Architecture: AXIVON LEARN

**Title:** End-to-End System Data Flow  
**Purpose:** Illustrates how data flows across client, API, middleware, and database layers for primary user journeys.  
**Status:** Implemented  
**Owner:** Senior Full Stack Architect  
**Last Updated:** 2026-10-31  

---

## 1. Flow A: Visitor Course Exploration to Enrollment

```
Client (Browser)             API Gateway (Express)           Database (MongoDB)
      │                                │                             │
      ├────── GET /courses ───────────►│                             │
      │                                ├── Course.find({status}) ───►│
      │                                │◄── Courses List ────────────┤
      │◄───── 200 OK (Courses) ────────┤                             │
      │                                │                             │
      ├────── POST /auth/register ────►│                             │
      │       {name, email, password}  ├── validate(registerSchema)  │
      │                                ├── hashPassword(bcrypt)      │
      │                                ├── User.create() ───────────►│
      │                                │◄── User Document ───────────┤
      │                                ├── signJWT()                 │
      │◄───── 201 Created (Cookie/JWT)─┤                             │
      │                                │                             │
      ├────── POST /enrollments/:id ──►│                             │
      │       (Bearer Token / Cookie)  ├── authenticate()            │
      │                                ├── Enrollment.create() ─────►│
      │◄───── 200 OK (Enrolled) ───────┤                             │
```

---

## 2. Flow B: Lesson Completion & Progress Calculation

```
Client (Lesson Player)           API (Progress Module)          Database (MongoDB)
      │                                │                             │
      ├────── POST /progress/:id ─────►│                             │
      │       (Token in header/cookie) ├── authenticate()            │
      │                                ├── findEnrollment(userId) ──►│
      │                                ├── pushLesson(completedIds)  │
      │                                ├── calcPercent(comp / total) │
      │                                ├── Enrollment.save() ───────►│
      │◄───── 200 OK (New %) ──────────┤                             │
```

---

## 3. Flow C: Secure Quiz Submission & Evaluation

```
Client (Quiz Player)             API (Quiz Module)              Database (MongoDB)
      │                                │                             │
      ├────── GET /quizzes/:quizId ───►│                             │
      │                                ├── QuizQuestion.find()       │
      │                                │   .select('-correctOption') │
      │◄───── 200 OK (Questions Only) ─┤                             │
      │                                │                             │
      ├────── POST /quizzes/:id/submit►│                             │
      │       {answers: {q1: 1, q2: 2}}├── authenticate()            │
      │                                ├── fetchAnswerKeys(private)─►│
      │                                ├── evaluateScoreServerSide() │
      │                                ├── QuizAttempt.create() ────►│
      │◄───── 200 OK (Score: 3/3, %) ──┤                             │
```
Notice that correct answers are never exposed to the client prior to evaluation.
