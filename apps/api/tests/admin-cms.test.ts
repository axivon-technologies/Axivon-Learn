import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import { resetRateLimitBuckets } from '../src/middleware/rateLimit';
import { resetMemoryUsers } from '../src/modules/users/user.store';
import { resetMemoryCatalog, MEMORY_CATALOG_IDS } from '../src/modules/courses/catalog.store';
import { resetMemoryLearnerState } from '../src/modules/enrollments/learner.store';
import { resetMemoryQuizzes } from '../src/modules/quizzes/quizzes.store';

describe('Admin CMS & Platform Metrics Domain Module (/api/v1/admin/*)', () => {
  beforeEach(() => {
    resetRateLimitBuckets();
    resetMemoryUsers();
    resetMemoryCatalog();
    resetMemoryLearnerState();
    resetMemoryQuizzes();
  });

  async function loginAsAdmin() {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@axivon.local',
      password: 'AxivonAdmin2026!'
    });
    return res.body.data.token as string;
  }

  async function loginAsLearner() {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'learner@axivon.local',
      password: 'AxivonLearner2026!'
    });
    return res.body.data.token as string;
  }

  it('rejects unauthenticated visitors on /api/v1/admin/* with 401 UNAUTHORIZED', async () => {
    const res = await request(app).get('/api/v1/admin/overview');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('rejects authenticated learners on ALL /api/v1/admin/* endpoints with 403 FORBIDDEN and zero side effects', async () => {
    const learnerToken = await loginAsLearner();

    const overviewRes = await request(app)
      .get('/api/v1/admin/overview')
      .set('Authorization', `Bearer ${learnerToken}`);
    expect(overviewRes.status).toBe(403);
    expect(overviewRes.body.data).toBeNull();
    expect(overviewRes.body.error.code).toBe('FORBIDDEN');

    const metricsRes = await request(app)
      .get('/api/v1/admin/metrics')
      .set('Authorization', `Bearer ${learnerToken}`);
    expect(metricsRes.status).toBe(403);

    const createCourseRes = await request(app)
      .post('/api/v1/admin/courses')
      .set('Authorization', `Bearer ${learnerToken}`)
      .send({
        title: 'Unauthorized Course Attempt',
        slug: 'unauthorized-course-attempt',
        summary: 'Should be rejected before touching database.',
        category: 'Web Development',
        status: 'published'
      });
    expect(createCourseRes.status).toBe(403);

    // Verify no side effect occurred in public catalog
    const checkCatalog = await request(app).get(
      '/api/v1/courses/unauthorized-course-attempt'
    );
    expect(checkCatalog.status).toBe(404);
  });

  it('returns accurate aggregated platform metrics on GET /admin/overview and GET /admin/metrics', async () => {
    const adminToken = await loginAsAdmin();

    const res = await request(app)
      .get('/api/v1/admin/metrics')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({
      totalCourses: 4,
      publishedCourses: 2,
      draftCourses: 1,
      archivedCourses: 1,
      totalCategories: 3,
      activeCategories: 3,
      totalModules: 3,
      totalLessons: 5,
      totalQuizzes: 3,
      totalUsers: 2,
      totalLearners: 1,
      totalEnrollments: 0,
      totalQuizAttempts: 0
    });

    const overviewRes = await request(app)
      .get('/api/v1/admin/overview')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(overviewRes.status).toBe(200);
    expect(overviewRes.body.data.publishedCourses).toBe(2);
  });

  it('allows admin to create and update categories and blocks duplicate slugs (409)', async () => {
    const adminToken = await loginAsAdmin();

    const createRes = await request(app)
      .post('/api/v1/admin/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Cybersecurity Engineering',
        slug: 'cybersecurity',
        description: 'Network defense, OWASP Top 10, and secure coding.',
        sortOrder: 4
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.data.slug).toBe('cybersecurity');

    // Duplicate slug -> 409 CONFLICT
    const dupRes = await request(app)
      .post('/api/v1/admin/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Duplicate Cyber',
        slug: 'cybersecurity'
      });
    expect(dupRes.status).toBe(409);

    // Update category -> deactivate and verify it hides from public GET /categories
    const patchRes = await request(app)
      .patch(`/api/v1/admin/categories/${createRes.body.data.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ isActive: false });
    expect(patchRes.status).toBe(200);
    expect(patchRes.body.data.isActive).toBe(false);

    const publicCatRes = await request(app).get('/api/v1/categories/cybersecurity');
    expect(publicCatRes.status).toBe(404);
  });

  it('completes full Admin CMS authoring lifecycle: draft course -> module -> lesson -> publish -> visible publicly', async () => {
    const adminToken = await loginAsAdmin();

    // 1. Create draft course
    const courseRes = await request(app)
      .post('/api/v1/admin/courses')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Docker & Container Orchestration',
        slug: 'docker-container-orchestration',
        summary: 'Package, ship, and orchestrate resilient microservice containers.',
        description: 'Deep dive into Dockerfiles, multi-stage builds, and container networking.',
        category: 'Cloud & DevOps',
        level: 'intermediate',
        status: 'draft',
        estimatedDurationHours: 6
      });

    expect(courseRes.status).toBe(201);
    const courseId = courseRes.body.data.id as string;
    expect(courseRes.body.data.status).toBe('draft');
    expect(courseRes.body.data.publishedAt).toBeNull();

    // Verify public catalog does NOT expose the draft course yet
    const whileDraftRes = await request(app).get(
      '/api/v1/courses/docker-container-orchestration'
    );
    expect(whileDraftRes.status).toBe(404);

    // 2. Add a module to the course
    const modRes = await request(app)
      .post(`/api/v1/admin/courses/${courseId}/modules`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Container Fundamentals',
        description: 'Images, layers, and namespaces',
        order: 1
      });
    expect(modRes.status).toBe(201);
    const moduleId = modRes.body.data.id as string;

    // 3. Add a lesson to the module with permitted embed & source attribution
    const lessonRes = await request(app)
      .post(`/api/v1/admin/modules/${moduleId}/lessons`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Writing Clean Multi-Stage Dockerfiles',
        slug: 'multi-stage-dockerfiles',
        description: 'Minimize image size and attack surface using multi-stage builds.',
        contentType: 'video',
        videoProvider: 'youtube',
        videoEmbedId: 'fqMOX6JJhGo',
        sourceAttribution: 'Axivon DevOps Curriculum (Permitted YouTube Embed)',
        contentRightsStatus: 'permitted_embed',
        durationMinutes: 22,
        isFreePreview: true,
        status: 'published'
      });
    expect(lessonRes.status).toBe(201);
    const lessonId = lessonRes.body.data.id as string;

    // 4. Publish the course via PATCH /admin/courses/:id
    const publishRes = await request(app)
      .patch(`/api/v1/admin/courses/${courseId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'published' });
    expect(publishRes.status).toBe(200);
    expect(publishRes.body.data.status).toBe('published');
    expect(publishRes.body.data.publishedAt).toBeTypeOf('string');

    // 5. Public catalog now immediately serves the published course + module + lesson!
    const afterPublishRes = await request(app).get(
      '/api/v1/courses/docker-container-orchestration'
    );
    expect(afterPublishRes.status).toBe(200);
    expect(afterPublishRes.body.data.moduleCount).toBe(1);
    expect(afterPublishRes.body.data.lessonCount).toBe(1);
    expect(afterPublishRes.body.data.modules[0].lessons[0].id).toBe(lessonId);
  });

  it('allows admin to update modules and lessons including contentRightsStatus', async () => {
    const adminToken = await loginAsAdmin();

    const modPatch = await request(app)
      .patch(`/api/v1/admin/modules/${MEMORY_CATALOG_IDS.modAI1}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Updated Module 1 Title' });
    expect(modPatch.status).toBe(200);
    expect(modPatch.body.data.title).toBe('Updated Module 1 Title');

    const lessonPatch = await request(app)
      .patch(`/api/v1/admin/lessons/${MEMORY_CATALOG_IDS.lessonAI1}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ contentRightsStatus: 'pending_review' });
    expect(lessonPatch.status).toBe(200);
    expect(lessonPatch.body.data.contentRightsStatus).toBe('pending_review');

    // Learner lesson player immediately enforces the updated rights restriction
    const playerRes = await request(app).get(
      `/api/v1/lessons/${MEMORY_CATALOG_IDS.lessonAI1}`
    );
    expect(playerRes.status).toBe(200);
    expect(playerRes.body.data.embedAllowed).toBe(false);
  });

  it('allows admin to author, validate, and publish quizzes that enrolled learners can complete', async () => {
    const adminToken = await loginAsAdmin();
    const learnerToken = await loginAsLearner();

    // Reject invalid correctOptionIndex >= options.length
    const invalidQuizRes = await request(app)
      .post('/api/v1/admin/quizzes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        courseId: MEMORY_CATALOG_IDS.courseAI,
        title: 'Invalid Answer Index Quiz',
        passingScore: 1,
        questions: [
          {
            prompt: 'Sample binary question?',
            options: ['Yes', 'No'],
            correctOptionIndex: 5
          }
        ]
      });
    expect(invalidQuizRes.status).toBe(400);

    // Create valid draft quiz
    const createQuizRes = await request(app)
      .post('/api/v1/admin/quizzes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        courseId: MEMORY_CATALOG_IDS.courseAI,
        title: 'Module 2 Assessment: Regression Metrics',
        description: 'Evaluate regression loss and R-squared.',
        passingScore: 1,
        status: 'draft',
        questions: [
          {
            prompt: 'What does an R-squared score of 1.0 indicate on validation data?',
            options: [
              'Zero variance explained',
              'Perfect linear fit of target variance',
              'Server timeout'
            ],
            correctOptionIndex: 1,
            explanation: 'R-squared = 1.0 means predictions explain 100% of variance.'
          }
        ]
      });
    expect(createQuizRes.status).toBe(201);
    const quizId = createQuizRes.body.data.id as string;

    // Publish quiz via PATCH /admin/quizzes/:id
    const pubQuizRes = await request(app)
      .patch(`/api/v1/admin/quizzes/${quizId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'published' });
    expect(pubQuizRes.status).toBe(200);
    expect(pubQuizRes.body.data.status).toBe('published');

    // Learner fetches published quiz (no answer key) -> enrolls -> submits correct answer
    const getQuizRes = await request(app).get(`/api/v1/quizzes/${quizId}`);
    expect(getQuizRes.status).toBe(200);
    const questionId = getQuizRes.body.data.questions[0].id as string;
    expect(getQuizRes.body.data.questions[0]).not.toHaveProperty('correctOptionIndex');

    await request(app)
      .post(`/api/v1/courses/${MEMORY_CATALOG_IDS.courseAI}/enroll`)
      .set('Authorization', `Bearer ${learnerToken}`);

    const attemptRes = await request(app)
      .post(`/api/v1/quizzes/${quizId}/attempts`)
      .set('Authorization', `Bearer ${learnerToken}`)
      .send({ answers: { [questionId]: 1 } });
    expect(attemptRes.status).toBe(201);
    expect(attemptRes.body.data).toMatchObject({
      score: 1,
      totalQuestions: 1,
      passed: true
    });
  });

  it('lists all admin courses & quizzes (including drafts) and returns 400 on malformed admin IDs', async () => {
    const adminToken = await loginAsAdmin();

    const coursesRes = await request(app)
      .get('/api/v1/admin/courses')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(coursesRes.status).toBe(200);
    expect(coursesRes.body.data.length).toBe(4); // 2 published + 1 draft + 1 archived

    const detailRes = await request(app)
      .get(`/api/v1/admin/courses/${MEMORY_CATALOG_IDS.courseAI}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(detailRes.status).toBe(200);
    // Admin detail includes the draft lesson too (3 total lessons on courseAI)
    const totalLessonsInEditor = detailRes.body.data.modules.reduce(
      (sum: number, m: { lessons: unknown[] }) => sum + m.lessons.length,
      0
    );
    expect(totalLessonsInEditor).toBe(3);

    const quizzesRes = await request(app)
      .get('/api/v1/admin/quizzes')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(quizzesRes.status).toBe(200);
    expect(quizzesRes.body.data.length).toBe(3);

    const badIdRes = await request(app)
      .patch('/api/v1/admin/courses/not-an-object-id')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'published' });
    expect(badIdRes.status).toBe(400);
    expect(badIdRes.body.error.code).toBe('VALIDATION_ERROR');
  });
});
