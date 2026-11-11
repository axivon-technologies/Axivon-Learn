import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import { resetRateLimitBuckets } from '../src/middleware/rateLimit';
import { resetMemoryUsers } from '../src/modules/users/user.store';
import { resetMemoryCatalog, MEMORY_CATALOG_IDS } from '../src/modules/courses/catalog.store';
import { resetMemoryLearnerState } from '../src/modules/enrollments/learner.store';
import { resetMemoryQuizzes, MEMORY_QUIZ_IDS } from '../src/modules/quizzes/quizzes.store';

describe('Quizzes & Assessments Domain Module (/quizzes & /me/quiz-attempts)', () => {
  beforeEach(() => {
    resetRateLimitBuckets();
    resetMemoryUsers();
    resetMemoryCatalog();
    resetMemoryLearnerState();
    resetMemoryQuizzes();
  });

  async function loginAsLearner() {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'learner@axivon.local',
      password: 'AxivonLearner2026!'
    });
    return {
      token: res.body.data.token as string,
      userId: res.body.data.user.id as string
    };
  }

  it('lists published quizzes for a published course and hides draft quizzes', async () => {
    const res = await request(app).get(
      `/api/v1/courses/${MEMORY_CATALOG_IDS.courseAI}/quizzes`
    );
    expect(res.status).toBe(200);
    // courseAI has 1 published quiz (quizAI) and 1 draft quiz (quizDraft)
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0]).toMatchObject({
      id: MEMORY_QUIZ_IDS.quizAI,
      title: 'Module 1 Assessment: Machine Learning Foundations',
      passingScore: 2,
      questionCount: 3
    });
  });

  it('returns quiz questions WITHOUT answer keys before submit, and rejects draft/malformed quiz IDs', async () => {
    const res = await request(app).get(`/api/v1/quizzes/${MEMORY_QUIZ_IDS.quizWeb}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({
      quizId: MEMORY_QUIZ_IDS.quizWeb,
      title: 'Module 1 Assessment: REST & Web Fundamentals',
      passingScore: 2,
      totalQuestions: 3
    });
    expect(res.body.data.questions).toHaveLength(3);

    // CRITICAL QA GATE: correctOptionIndex / correctAnswerKey / explanation MUST NOT leak
    for (const q of res.body.data.questions) {
      expect(q).not.toHaveProperty('correctOptionIndex');
      expect(q).not.toHaveProperty('correctAnswerKey');
      expect(q).not.toHaveProperty('explanation');
      expect(q.options.length).toBeGreaterThanOrEqual(2);
    }

    const rawBody = JSON.stringify(res.body);
    expect(rawBody).not.toContain('correctOptionIndex');

    // Draft quiz returns 404
    const draftRes = await request(app).get(`/api/v1/quizzes/${MEMORY_QUIZ_IDS.quizDraft}`);
    expect(draftRes.status).toBe(404);

    // Invalid quizId returns 400
    const badIdRes = await request(app).get('/api/v1/quizzes/not-a-valid-id');
    expect(badIdRes.status).toBe(400);
    expect(badIdRes.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects quiz submission from unauthenticated visitors (401) and non-enrolled learners (403)', async () => {
    const validAnswers = {
      [MEMORY_QUIZ_IDS.qWeb1]: 1,
      [MEMORY_QUIZ_IDS.qWeb2]: 1,
      [MEMORY_QUIZ_IDS.qWeb3]: 2
    };

    const visitorRes = await request(app)
      .post(`/api/v1/quizzes/${MEMORY_QUIZ_IDS.quizWeb}/attempts`)
      .send({ answers: validAnswers });
    expect(visitorRes.status).toBe(401);

    const { token } = await loginAsLearner();
    const unEnrolledRes = await request(app)
      .post(`/api/v1/quizzes/${MEMORY_QUIZ_IDS.quizWeb}/attempts`)
      .set('Authorization', `Bearer ${token}`)
      .send({ answers: validAnswers });
    expect(unEnrolledRes.status).toBe(403);
    expect(unEnrolledRes.body.error.code).toBe('FORBIDDEN');
  });

  it('computes quiz score & pass/fail strictly on the server and ignores forged client score fields', async () => {
    const { token } = await loginAsLearner();

    await request(app)
      .post(`/api/v1/courses/${MEMORY_CATALOG_IDS.courseWeb}/enroll`)
      .set('Authorization', `Bearer ${token}`);

    // Attempt 1: Submit 1/3 correct answers WHILE forging { score: 999, passed: true } in body
    const failAttempt = await request(app)
      .post(`/api/v1/quizzes/${MEMORY_QUIZ_IDS.quizWeb}/attempts`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        answers: {
          [MEMORY_QUIZ_IDS.qWeb1]: 1, // Correct
          [MEMORY_QUIZ_IDS.qWeb2]: 0, // Wrong
          [MEMORY_QUIZ_IDS.qWeb3]: 0 // Wrong
        },
        score: 999,
        passed: true
      });

    expect(failAttempt.status).toBe(201);
    expect(failAttempt.body.data).toMatchObject({
      score: 1,
      total: 3,
      totalQuestions: 3,
      passingScore: 2,
      passed: false,
      attemptNumber: 1,
      remainingAttempts: 4
    });

    // Attempt 2: Submit 3/3 correct answers via /submit alias using array format -> 200 OK & passed: true
    const passAttempt = await request(app)
      .post(`/api/v1/quizzes/${MEMORY_QUIZ_IDS.quizWeb}/submit`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        answers: [
          { questionId: MEMORY_QUIZ_IDS.qWeb1, selectedOptionIndex: 1 },
          { questionId: MEMORY_QUIZ_IDS.qWeb2, selectedOptionIndex: 1 },
          { questionId: MEMORY_QUIZ_IDS.qWeb3, selectedOptionIndex: 2 }
        ]
      });

    expect(passAttempt.status).toBe(200);
    expect(passAttempt.body.data).toMatchObject({
      score: 3,
      total: 3,
      percentage: 100,
      passed: true,
      attemptNumber: 2,
      remainingAttempts: 3
    });
  });

  it('rejects incomplete, out-of-bounds, or unknown-question quiz submissions with 400 VALIDATION_ERROR', async () => {
    const { token } = await loginAsLearner();

    await request(app)
      .post(`/api/v1/courses/${MEMORY_CATALOG_IDS.courseWeb}/enroll`)
      .set('Authorization', `Bearer ${token}`);

    // Missing qWeb3
    const incompleteRes = await request(app)
      .post(`/api/v1/quizzes/${MEMORY_QUIZ_IDS.quizWeb}/attempts`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        answers: {
          [MEMORY_QUIZ_IDS.qWeb1]: 1,
          [MEMORY_QUIZ_IDS.qWeb2]: 1
        }
      });
    expect(incompleteRes.status).toBe(400);
    expect(incompleteRes.body.error.code).toBe('VALIDATION_ERROR');

    // Out-of-bounds option index (99)
    const outOfBoundsRes = await request(app)
      .post(`/api/v1/quizzes/${MEMORY_QUIZ_IDS.quizWeb}/attempts`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        answers: {
          [MEMORY_QUIZ_IDS.qWeb1]: 99,
          [MEMORY_QUIZ_IDS.qWeb2]: 1,
          [MEMORY_QUIZ_IDS.qWeb3]: 2
        }
      });
    expect(outOfBoundsRes.status).toBe(400);

    // Foreign questionId from another quiz
    const foreignQuestionRes = await request(app)
      .post(`/api/v1/quizzes/${MEMORY_QUIZ_IDS.quizWeb}/attempts`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        answers: {
          [MEMORY_QUIZ_IDS.qAI1]: 1,
          [MEMORY_QUIZ_IDS.qWeb1]: 1,
          [MEMORY_QUIZ_IDS.qWeb2]: 1,
          [MEMORY_QUIZ_IDS.qWeb3]: 2
        }
      });
    expect(foreignQuestionRes.status).toBe(400);
  });

  it('enforces the per-learner quiz attempt cap (MAX_ATTEMPTS_PER_QUIZ = 5)', async () => {
    const { token } = await loginAsLearner();

    await request(app)
      .post(`/api/v1/courses/${MEMORY_CATALOG_IDS.courseWeb}/enroll`)
      .set('Authorization', `Bearer ${token}`);

    const validPayload = {
      answers: {
        [MEMORY_QUIZ_IDS.qWeb1]: 1,
        [MEMORY_QUIZ_IDS.qWeb2]: 1,
        [MEMORY_QUIZ_IDS.qWeb3]: 2
      }
    };

    for (let i = 1; i <= 5; i++) {
      const res = await request(app)
        .post(`/api/v1/quizzes/${MEMORY_QUIZ_IDS.quizWeb}/attempts`)
        .set('Authorization', `Bearer ${token}`)
        .send(validPayload);
      expect(res.status).toBe(201);
      expect(res.body.data.attemptNumber).toBe(i);
    }

    // 6th attempt must be blocked with 409 ATTEMPT_LIMIT_REACHED
    const sixthRes = await request(app)
      .post(`/api/v1/quizzes/${MEMORY_QUIZ_IDS.quizWeb}/attempts`)
      .set('Authorization', `Bearer ${token}`)
      .send(validPayload);
    expect(sixthRes.status).toBe(409);
    expect(sixthRes.body.error.code).toBe('ATTEMPT_LIMIT_REACHED');
  });

  it('returns strictly the authenticated learner\'s own quiz attempt history on GET /me/quiz-attempts', async () => {
    const learnerA = await loginAsLearner();
    await request(app)
      .post(`/api/v1/courses/${MEMORY_CATALOG_IDS.courseWeb}/enroll`)
      .set('Authorization', `Bearer ${learnerA.token}`);

    await request(app)
      .post(`/api/v1/quizzes/${MEMORY_QUIZ_IDS.quizWeb}/attempts`)
      .set('Authorization', `Bearer ${learnerA.token}`)
      .send({
        answers: {
          [MEMORY_QUIZ_IDS.qWeb1]: 1,
          [MEMORY_QUIZ_IDS.qWeb2]: 1,
          [MEMORY_QUIZ_IDS.qWeb3]: 2
        }
      });

    // Register Learner B -> Learner B must see 0 attempts on /me/quiz-attempts
    const regB = await request(app).post('/api/v1/auth/register').send({
      name: 'Other Learner',
      email: 'otherlearner@example.com',
      password: 'Password123!'
    });
    const learnerBToken = regB.body.data.token as string;

    const historyB = await request(app)
      .get('/api/v1/me/quiz-attempts')
      .set('Authorization', `Bearer ${learnerBToken}`);
    expect(historyB.status).toBe(200);
    expect(historyB.body.data).toHaveLength(0);

    const historyA = await request(app)
      .get('/api/v1/me/quiz-attempts')
      .set('Authorization', `Bearer ${learnerA.token}`);
    expect(historyA.status).toBe(200);
    expect(historyA.body.data).toHaveLength(1);
    expect(historyA.body.data[0]).toMatchObject({
      quizId: MEMORY_QUIZ_IDS.quizWeb,
      score: 3,
      passed: true
    });
  });
});
