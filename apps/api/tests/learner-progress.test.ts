import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import { resetRateLimitBuckets } from '../src/middleware/rateLimit';
import { resetMemoryUsers } from '../src/modules/users/user.store';
import {
  resetMemoryCatalog,
  setMemoryLessonRightsStatus,
  MEMORY_CATALOG_IDS
} from '../src/modules/courses/catalog.store';
import { resetMemoryLearnerState } from '../src/modules/enrollments/learner.store';

describe('Learner Journey Domain Modules (/enrollments, /modules, /lessons, /progress)', () => {
  beforeEach(() => {
    resetRateLimitBuckets();
    resetMemoryUsers();
    resetMemoryCatalog();
    resetMemoryLearnerState();
  });

  async function loginAsDefaultLearner() {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'learner@axivon.local',
      password: 'AxivonLearner2026!'
    });
    return {
      token: res.body.data.token as string,
      userId: res.body.data.user.id as string
    };
  }

  async function loginAsAdmin() {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@axivon.local',
      password: 'AxivonAdmin2026!'
    });
    return {
      token: res.body.data.token as string,
      userId: res.body.data.user.id as string
    };
  }

  it('enrolls learner idempotently (201 then 200) and lists enrollments via /me/enrollments and /enrollments', async () => {
    const { token } = await loginAsDefaultLearner();

    const firstEnroll = await request(app)
      .post(`/api/v1/courses/${MEMORY_CATALOG_IDS.courseAI}/enroll`)
      .set('Authorization', `Bearer ${token}`);

    expect(firstEnroll.status).toBe(201);
    expect(firstEnroll.body.data).toMatchObject({
      courseId: MEMORY_CATALOG_IDS.courseAI,
      status: 'in_progress',
      progressPercent: 0,
      completedLessonsCount: 0,
      totalLessons: 2
    });
    expect(firstEnroll.body.data.course.slug).toBe('ai-ml-foundations');

    // Second enroll call is idempotent -> 200 OK, no duplicate enrollment record
    const secondEnroll = await request(app)
      .post(`/api/v1/courses/${MEMORY_CATALOG_IDS.courseAI}/enroll`)
      .set('Authorization', `Bearer ${token}`);

    expect(secondEnroll.status).toBe(200);
    expect(secondEnroll.body.data.id).toBe(firstEnroll.body.data.id);

    const meEnrollments = await request(app)
      .get('/api/v1/me/enrollments')
      .set('Authorization', `Bearer ${token}`);
    expect(meEnrollments.status).toBe(200);
    expect(meEnrollments.body.data).toHaveLength(1);

    const legacyEnrollments = await request(app)
      .get('/api/v1/enrollments')
      .set('Authorization', `Bearer ${token}`);
    expect(legacyEnrollments.status).toBe(200);
    expect(legacyEnrollments.body.data).toHaveLength(1);
  });

  it('rejects enrollment into draft/archived/missing courses (404) and malformed course IDs (400)', async () => {
    const { token } = await loginAsDefaultLearner();

    const draftEnroll = await request(app)
      .post(`/api/v1/courses/${MEMORY_CATALOG_IDS.courseDraft}/enroll`)
      .set('Authorization', `Bearer ${token}`);
    expect(draftEnroll.status).toBe(404);
    expect(draftEnroll.body.error.code).toBe('NOT_FOUND');

    const badIdEnroll = await request(app)
      .post('/api/v1/courses/not-a-valid-objectid/enroll')
      .set('Authorization', `Bearer ${token}`);
    expect(badIdEnroll.status).toBe(400);
    expect(badIdEnroll.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns ordered modules and lesson lock states before and after enrollment', async () => {
    const { token } = await loginAsDefaultLearner();

    const modRes = await request(app).get(
      `/api/v1/courses/${MEMORY_CATALOG_IDS.courseAI}/modules`
    );
    expect(modRes.status).toBe(200);
    expect(modRes.body.data).toHaveLength(2);
    expect(modRes.body.data[0].order).toBe(1);

    // Before enrollment: Lesson 1 (isFreePreview=true) unlocked, Lesson 2 (isFreePreview=false) locked
    const beforeLessons = await request(app)
      .get(`/api/v1/courses/${MEMORY_CATALOG_IDS.courseAI}/lessons`)
      .set('Authorization', `Bearer ${token}`);
    expect(beforeLessons.status).toBe(200);
    expect(beforeLessons.body.data.isEnrolled).toBe(false);
    expect(beforeLessons.body.data.lessons).toHaveLength(2);
    expect(beforeLessons.body.data.lessons[0].isLocked).toBe(false);
    expect(beforeLessons.body.data.lessons[1].isLocked).toBe(true);

    // Enroll -> both lessons unlocked
    await request(app)
      .post(`/api/v1/courses/${MEMORY_CATALOG_IDS.courseAI}/enroll`)
      .set('Authorization', `Bearer ${token}`);

    const afterLessons = await request(app)
      .get(`/api/v1/courses/${MEMORY_CATALOG_IDS.courseAI}/lessons`)
      .set('Authorization', `Bearer ${token}`);
    expect(afterLessons.status).toBe(200);
    expect(afterLessons.body.data.isEnrolled).toBe(true);
    expect(afterLessons.body.data.lessons[1].isLocked).toBe(false);
  });

  it('allows public visitors to view free-preview lessons while rejecting locked lessons with 401', async () => {
    const previewRes = await request(app).get(
      `/api/v1/lessons/${MEMORY_CATALOG_IDS.lessonAI1}`
    );
    expect(previewRes.status).toBe(200);
    expect(previewRes.body.data).toMatchObject({
      id: MEMORY_CATALOG_IDS.lessonAI1,
      isFreePreview: true,
      embedAllowed: true,
      videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/ukzFI9rgwfU'
    });
    expect(previewRes.body.data.sourceAttribution).toContain('Axivon');
    expect(previewRes.body.data.navigation).toEqual({
      previousLessonId: null,
      nextLessonId: MEMORY_CATALOG_IDS.lessonAI2,
      totalCourseLessons: 2
    });

    const lockedVisitorRes = await request(app).get(
      `/api/v1/lessons/${MEMORY_CATALOG_IDS.lessonAI2}`
    );
    expect(lockedVisitorRes.status).toBe(401);
    expect(lockedVisitorRes.body.error.code).toBe('UNAUTHORIZED');
  });

  it('enforces enrollment access on locked lessons (403 before enroll, 200 after enroll) and rejects draft lessons (404)', async () => {
    const { token } = await loginAsDefaultLearner();

    const unEnrolledRes = await request(app)
      .get(`/api/v1/lessons/${MEMORY_CATALOG_IDS.lessonAI2}`)
      .set('Authorization', `Bearer ${token}`);
    expect(unEnrolledRes.status).toBe(403);
    expect(unEnrolledRes.body.error.code).toBe('FORBIDDEN');

    await request(app)
      .post(`/api/v1/courses/${MEMORY_CATALOG_IDS.courseAI}/enroll`)
      .set('Authorization', `Bearer ${token}`);

    const enrolledRes = await request(app)
      .get(`/api/v1/lessons/${MEMORY_CATALOG_IDS.lessonAI2}`)
      .set('Authorization', `Bearer ${token}`);
    expect(enrolledRes.status).toBe(200);
    expect(enrolledRes.body.data.id).toBe(MEMORY_CATALOG_IDS.lessonAI2);
    expect(enrolledRes.body.data.progress?.status).toBe('in_progress');

    // Draft lesson must return 404 even when enrolled
    const draftLessonRes = await request(app)
      .get(`/api/v1/lessons/${MEMORY_CATALOG_IDS.lessonAIDraft}`)
      .set('Authorization', `Bearer ${token}`);
    expect(draftLessonRes.status).toBe(404);

    // Invalid lessonId format returns safe 400 validation error without crashing
    const invalidLessonIdRes = await request(app).get('/api/v1/lessons/bad-id');
    expect(invalidLessonIdRes.status).toBe(400);
    expect(invalidLessonIdRes.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('withholds video embed URLs and returns safe fallbackNotice when contentRightsStatus is pending_review', async () => {
    setMemoryLessonRightsStatus(MEMORY_CATALOG_IDS.lessonAI1, 'pending_review');

    const res = await request(app).get(`/api/v1/lessons/${MEMORY_CATALOG_IDS.lessonAI1}`);
    expect(res.status).toBe(200);
    expect(res.body.data.embedAllowed).toBe(false);
    expect(res.body.data.videoUrl).toBe('');
    expect(res.body.data.videoEmbedUrl).toBe('');
    expect(res.body.data.fallbackNotice).toBeTypeOf('string');
    expect(res.body.data.resourceLinks.length).toBeGreaterThan(0);
  });

  it('requires course enrollment before saving lesson progress and computes 50% -> 100% completion accurately', async () => {
    const { token } = await loginAsDefaultLearner();

    // Un-enrolled progress write -> 403 FORBIDDEN
    const beforeEnroll = await request(app)
      .put(`/api/v1/lessons/${MEMORY_CATALOG_IDS.lessonAI1}/progress`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'completed' });
    expect(beforeEnroll.status).toBe(403);

    await request(app)
      .post(`/api/v1/courses/${MEMORY_CATALOG_IDS.courseAI}/enroll`)
      .set('Authorization', `Bearer ${token}`);

    // Complete Lesson 1 of 2 -> 50%
    const prog1 = await request(app)
      .put(`/api/v1/lessons/${MEMORY_CATALOG_IDS.lessonAI1}/progress`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'completed' });
    expect(prog1.status).toBe(200);
    expect(prog1.body.data.lessonProgress.status).toBe('completed');
    expect(prog1.body.data.courseProgress.progressPercent).toBe(50);
    expect(prog1.body.data.courseProgress.status).toBe('in_progress');
    expect(prog1.body.data.courseProgress.nextLesson.id).toBe(MEMORY_CATALOG_IDS.lessonAI2);

    // Complete Lesson 2 of 2 -> 100% & course completedAt populated
    const prog2 = await request(app)
      .put(`/api/v1/lessons/${MEMORY_CATALOG_IDS.lessonAI2}/progress`)
      .set('Authorization', `Bearer ${token}`)
      .send({ completed: true });
    expect(prog2.status).toBe(200);
    expect(prog2.body.data.courseProgress.progressPercent).toBe(100);
    expect(prog2.body.data.courseProgress.status).toBe('completed');
    expect(prog2.body.data.courseProgress.completedAt).toBeTypeOf('string');
  });

  it('handles idempotent repeat completions and persists progress across logout and re-login', async () => {
    const { token } = await loginAsDefaultLearner();

    await request(app)
      .post(`/api/v1/courses/${MEMORY_CATALOG_IDS.courseAI}/enroll`)
      .set('Authorization', `Bearer ${token}`);

    const firstComplete = await request(app)
      .put(`/api/v1/lessons/${MEMORY_CATALOG_IDS.lessonAI1}/progress`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'completed' });
    const firstCompletedAt = firstComplete.body.data.lessonProgress.completedAt;

    // Repeat completion is idempotent: preserves original completedAt and keeps 50%
    const repeatComplete = await request(app)
      .put(`/api/v1/lessons/${MEMORY_CATALOG_IDS.lessonAI1}/progress`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'completed' });
    expect(repeatComplete.status).toBe(200);
    expect(repeatComplete.body.data.lessonProgress.completedAt).toBe(firstCompletedAt);
    expect(repeatComplete.body.data.courseProgress.progressPercent).toBe(50);

    // Logout & re-login -> persisted progress remains intact on /me/progress
    await request(app).post('/api/v1/auth/logout');
    const relogin = await loginAsDefaultLearner();

    const myProgress = await request(app)
      .get('/api/v1/me/progress')
      .set('Authorization', `Bearer ${relogin.token}`);
    expect(myProgress.status).toBe(200);
    expect(myProgress.body.data.summary).toEqual({
      enrolledCoursesCount: 1,
      completedCoursesCount: 0,
      inProgressCoursesCount: 1,
      totalCompletedLessons: 1
    });
    expect(myProgress.body.data.courses[0].progressPercent).toBe(50);
  });

  it('blocks a learner from editing another user\'s progress (403 FORBIDDEN) and leaves other record unchanged', async () => {
    const learnerA = await loginAsDefaultLearner();

    await request(app)
      .post(`/api/v1/courses/${MEMORY_CATALOG_IDS.courseAI}/enroll`)
      .set('Authorization', `Bearer ${learnerA.token}`);

    // Register a second learner (Learner B)
    const regB = await request(app).post('/api/v1/auth/register').send({
      name: 'Intruder Learner',
      email: 'intruder@example.com',
      password: 'Password123!'
    });
    const learnerBToken = regB.body.data.token as string;

    // Vector 1: Learner B passes Learner A's userId in PUT /lessons/:lessonId/progress body -> 403
    const bodyTamperRes = await request(app)
      .put(`/api/v1/lessons/${MEMORY_CATALOG_IDS.lessonAI1}/progress`)
      .set('Authorization', `Bearer ${learnerBToken}`)
      .send({ userId: learnerA.userId, status: 'completed' });
    expect(bodyTamperRes.status).toBe(403);
    expect(bodyTamperRes.body.error.code).toBe('FORBIDDEN');

    // Vector 2: Learner B calls PUT /users/:learnerAId/lessons/:lessonId/progress -> 403
    const pathTamperRes = await request(app)
      .put(
        `/api/v1/users/${learnerA.userId}/lessons/${MEMORY_CATALOG_IDS.lessonAI1}/progress`
      )
      .set('Authorization', `Bearer ${learnerBToken}`)
      .send({ status: 'completed' });
    expect(pathTamperRes.status).toBe(403);
    expect(pathTamperRes.body.error.code).toBe('FORBIDDEN');

    // Verify Learner A's progress is completely untouched (still 0%)
    const checkA = await request(app)
      .get('/api/v1/me/progress')
      .set('Authorization', `Bearer ${learnerA.token}`);
    expect(checkA.body.data.summary.totalCompletedLessons).toBe(0);
    expect(checkA.body.data.courses[0].progressPercent).toBe(0);
  });

  it('enforces horizontal ownership on GET /users/:userId/progress (learner -> 403, admin -> 200)', async () => {
    const learnerA = await loginAsDefaultLearner();
    await request(app)
      .post(`/api/v1/courses/${MEMORY_CATALOG_IDS.courseAI}/enroll`)
      .set('Authorization', `Bearer ${learnerA.token}`);

    const regB = await request(app).post('/api/v1/auth/register').send({
      name: 'Second Learner',
      email: 'second@example.com',
      password: 'Password123!'
    });
    const learnerBToken = regB.body.data.token as string;

    const forbiddenRead = await request(app)
      .get(`/api/v1/users/${learnerA.userId}/progress`)
      .set('Authorization', `Bearer ${learnerBToken}`);
    expect(forbiddenRead.status).toBe(403);

    const admin = await loginAsAdmin();
    const adminRead = await request(app)
      .get(`/api/v1/users/${learnerA.userId}/progress`)
      .set('Authorization', `Bearer ${admin.token}`);
    expect(adminRead.status).toBe(200);
    expect(adminRead.body.data.userId).toBe(learnerA.userId);
    expect(adminRead.body.data.summary.enrolledCoursesCount).toBe(1);
  });
});
