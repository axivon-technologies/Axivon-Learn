import fs from 'fs';
import path from 'path';
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import { validateEnv } from '../src/config/env';
import { resetRateLimitBuckets } from '../src/middleware/rateLimit';
import { resetMemoryUsers } from '../src/modules/users/user.store';
import { resetMemoryCatalog } from '../src/modules/courses/catalog.store';
import { resetMemoryLearnerState } from '../src/modules/enrollments/learner.store';
import { resetMemoryQuizzes } from '../src/modules/quizzes/quizzes.store';

describe('Backend Handover: OpenAPI Contract, Production Env Guards & Full E2E Journey', () => {
  beforeEach(() => {
    resetRateLimitBuckets();
    resetMemoryUsers();
    resetMemoryCatalog();
    resetMemoryLearnerState();
    resetMemoryQuizzes();
  });

  it('serves valid OpenAPI 3.0.3 JSON at GET /api/v1/openapi.json in sync with openapi.json', async () => {
    const res = await request(app).get('/api/v1/openapi.json');
    expect(res.status).toBe(200);
    expect(res.body.openapi).toBe('3.0.3');
    expect(res.body.info.title).toBe('AXIVON LEARN REST API');
    expect(res.body.components.securitySchemes).toHaveProperty('bearerAuth');
    expect(res.body.components.securitySchemes).toHaveProperty('cookieAuth');

    const expectedPaths = [
      '/health',
      '/auth/register',
      '/auth/login',
      '/users/me',
      '/categories',
      '/courses',
      '/learning-paths',
      '/projects',
      '/courses/{courseId}/enroll',
      '/lessons/{lessonId}',
      '/lessons/{lessonId}/progress',
      '/quizzes/{quizId}',
      '/quizzes/{quizId}/attempts',
      '/admin/courses',
      '/admin/metrics'
    ];
    for (const p of expectedPaths) {
      expect(res.body.paths).toHaveProperty(p);
    }

    const staticSpecPath = path.resolve(__dirname, '../openapi.json');
    const staticSpec = JSON.parse(fs.readFileSync(staticSpecPath, 'utf8'));
    expect(res.body).toEqual(staticSpec);
  });

  it('fails fast in validateEnv() when NODE_ENV=production uses missing or dev-default secrets', () => {
    expect(() =>
      validateEnv({
        NODE_ENV: 'production',
        PORT: '5000',
        API_PREFIX: '/api/v1',
        CORS_ORIGIN: 'https://learn.axivon.tech'
      })
    ).toThrow(/Production security check failed/);

    expect(() =>
      validateEnv({
        NODE_ENV: 'production',
        PORT: '5000',
        API_PREFIX: '/api/v1',
        CORS_ORIGIN: 'https://learn.axivon.tech',
        MONGODB_URI: 'mongodb://db.internal:27017/axivon_learn',
        JWT_SECRET: 'axivon_learn_development_secret_key_minimum_32_chars',
        REFRESH_TOKEN_SECRET: 'axivon_learn_dev_refresh_secret_key_minimum_32_chars',
        COOKIE_SECRET: 'axivon_learn_cookie_secret_dev'
      })
    ).toThrow(/Production security check failed/);
  });

  it('rejects malformed PORT or API_PREFIX values in validateEnv()', () => {
    expect(() =>
      validateEnv({
        NODE_ENV: 'development',
        PORT: '99999',
        API_PREFIX: 'api/v1'
      })
    ).toThrow(/Invalid environment configuration/);
  });

  it('accepts strong unique production secrets and explicit MONGODB_URI in validateEnv()', () => {
    const cfg = validateEnv({
      NODE_ENV: 'production',
      PORT: '8080',
      API_PREFIX: '/api/v1',
      CORS_ORIGIN: 'https://learn.axivon.tech',
      MONGODB_URI: 'mongodb://prod-db.internal:27017/axivon_learn',
      JWT_SECRET: 'prod_jwt_secret_9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a',
      REFRESH_TOKEN_SECRET: 'prod_refresh_secret_1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
      COOKIE_SECRET: 'prod_cookie_secret_7f8e9d0c1b2a'
    });
    expect(cfg.NODE_ENV).toBe('production');
    expect(cfg.PORT).toBe(8080);
    expect(cfg.CORS_ORIGIN).toBe('https://learn.axivon.tech');
  });

  it('completes the full Admin CMS authoring -> Public Discovery -> Learner Enrollment, 100% Progress & Quiz Pass E2E flow', async () => {
    // 1. Admin logs in
    const adminLogin = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@axivon.local',
      password: 'AxivonAdmin2026!'
    });
    expect(adminLogin.status).toBe(200);
    const adminToken = adminLogin.body.data.token as string;

    // 2. Admin creates Category + Draft Course + Module + 2 Lessons + Published Quiz
    const catRes = await request(app)
      .post('/api/v1/admin/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Systems Engineering',
        slug: 'systems-engineering',
        description: 'Distributed backend systems, observability, and reliability.',
        icon: 'server',
        sortOrder: 4,
        isActive: true
      });
    expect(catRes.status).toBe(201);

    const courseRes = await request(app)
      .post('/api/v1/admin/courses')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Production Node.js & API Reliability',
        slug: 'production-nodejs-api-reliability',
        summary: 'Design resilient APIs with strict validation, RBAC, and automated testing.',
        description: 'End-to-end backend engineering course.',
        category: 'Systems Engineering',
        categoryId: catRes.body.data.id,
        level: 'intermediate',
        status: 'draft',
        estimatedDurationHours: 5
      });
    expect(courseRes.status).toBe(201);
    const courseId = courseRes.body.data.id as string;

    // Public visitor CANNOT view the course while in draft
    const draftCheck = await request(app).get('/api/v1/courses/production-nodejs-api-reliability');
    expect(draftCheck.status).toBe(404);

    const modRes = await request(app)
      .post(`/api/v1/admin/courses/${courseId}/modules`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Module 1: Defensive API Design',
        description: 'Validation, RBAC, and error envelopes',
        order: 1
      });
    expect(modRes.status).toBe(201);
    const moduleId = modRes.body.data.id as string;

    const lesson1Res = await request(app)
      .post(`/api/v1/admin/modules/${moduleId}/lessons`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: '1.1 Input Validation & Envelopes',
        slug: 'input-validation-envelopes',
        description: 'Schema validation with Zod and safe error envelopes.',
        contentType: 'video',
        videoProvider: 'youtube',
        videoEmbedId: '-MTSQjw5DrM',
        contentRightsStatus: 'permitted_embed',
        durationMinutes: 15,
        order: 1,
        isFreePreview: true,
        status: 'published'
      });
    expect(lesson1Res.status).toBe(201);
    const lesson1Id = lesson1Res.body.data.id as string;

    const lesson2Res = await request(app)
      .post(`/api/v1/admin/modules/${moduleId}/lessons`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: '1.2 RBAC & Horizontal Ownership',
        slug: 'rbac-horizontal-ownership',
        description: 'Preventing privilege escalation and cross-user tampering.',
        contentType: 'article',
        videoProvider: 'none',
        contentRightsStatus: 'owned',
        durationMinutes: 25,
        order: 2,
        isFreePreview: false,
        status: 'published'
      });
    expect(lesson2Res.status).toBe(201);
    const lesson2Id = lesson2Res.body.data.id as string;

    const quizRes = await request(app)
      .post('/api/v1/admin/quizzes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        courseId,
        moduleId,
        title: 'Defensive API Design Checkpoint',
        description: 'Verify core API security concepts.',
        passingScore: 2,
        status: 'published',
        questions: [
          {
            prompt: 'Which HTTP status code indicates authenticated user lacks permission?',
            options: ['200 OK', '401 Unauthorized', '403 Forbidden', '500 Internal Error'],
            correctOptionIndex: 2,
            explanation: '403 Forbidden means authenticated identity lacks required permission.'
          },
          {
            prompt: 'Where must quiz scores be calculated?',
            options: ['Browser localStorage', 'Authoritatively on the backend server', 'URL query string'],
            correctOptionIndex: 1,
            explanation: 'Server-side grading prevents client score forgery.'
          }
        ]
      });
    expect(quizRes.status).toBe(201);
    const quizId = quizRes.body.data.id as string;

    // 3. Admin publishes the Course
    const pubRes = await request(app)
      .patch(`/api/v1/admin/courses/${courseId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'published' });
    expect(pubRes.status).toBe(200);
    expect(pubRes.body.data.publishedAt).toBeTruthy();

    // 4. New Learner registers and discovers the published course
    const regRes = await request(app).post('/api/v1/auth/register').send({
      name: 'Priya Sharma',
      email: 'priya.sharma@axivon.local',
      password: 'StrongPassword2026!'
    });
    expect(regRes.status).toBe(201);
    const learnerToken = regRes.body.data.token as string;

    const catalogRes = await request(app).get('/api/v1/courses?category=systems-engineering');
    expect(catalogRes.status).toBe(200);
    expect(catalogRes.body.data).toHaveLength(1);
    expect(catalogRes.body.data[0].slug).toBe('production-nodejs-api-reliability');

    // Learner can preview Lesson 1 before enrollment, but Lesson 2 is locked (403)
    const previewRes = await request(app)
      .get(`/api/v1/lessons/${lesson1Id}`)
      .set('Authorization', `Bearer ${learnerToken}`);
    expect(previewRes.status).toBe(200);

    const lockedRes = await request(app)
      .get(`/api/v1/lessons/${lesson2Id}`)
      .set('Authorization', `Bearer ${learnerToken}`);
    expect(lockedRes.status).toBe(403);

    // 5. Learner enrolls, unlocks Lesson 2, completes both lessons (50% -> 100%)
    const enrollRes = await request(app)
      .post(`/api/v1/courses/${courseId}/enroll`)
      .set('Authorization', `Bearer ${learnerToken}`);
    expect(enrollRes.status).toBe(201);

    const unlockedRes = await request(app)
      .get(`/api/v1/lessons/${lesson2Id}`)
      .set('Authorization', `Bearer ${learnerToken}`);
    expect(unlockedRes.status).toBe(200);

    const prog1 = await request(app)
      .put(`/api/v1/lessons/${lesson1Id}/progress`)
      .set('Authorization', `Bearer ${learnerToken}`)
      .send({ status: 'completed' });
    expect(prog1.status).toBe(200);
    expect(prog1.body.data.courseProgress.progressPercent).toBe(50);

    const prog2 = await request(app)
      .put(`/api/v1/lessons/${lesson2Id}/progress`)
      .set('Authorization', `Bearer ${learnerToken}`)
      .send({ status: 'completed' });
    expect(prog2.status).toBe(200);
    expect(prog2.body.data.courseProgress.progressPercent).toBe(100);
    expect(prog2.body.data.courseProgress.status).toBe('completed');

    // 6. Learner fetches Quiz (no answer key leaked) and passes with 2/2
    const getQuizRes = await request(app)
      .get(`/api/v1/quizzes/${quizId}`)
      .set('Authorization', `Bearer ${learnerToken}`);
    expect(getQuizRes.status).toBe(200);
    const questions = getQuizRes.body.data.questions as Array<{ id: string; correctOptionIndex?: number }>;
    expect(questions).toHaveLength(2);
    expect(questions[0].correctOptionIndex).toBeUndefined();
    expect(questions[1].correctOptionIndex).toBeUndefined();

    const submitRes = await request(app)
      .post(`/api/v1/quizzes/${quizId}/attempts`)
      .set('Authorization', `Bearer ${learnerToken}`)
      .send({
        answers: {
          [questions[0].id]: 2,
          [questions[1].id]: 1
        }
      });
    expect(submitRes.status).toBe(201);
    expect(submitRes.body.data.score).toBe(2);
    expect(submitRes.body.data.passed).toBe(true);
    expect(submitRes.body.data.percentage).toBe(100);

    // 7. Verify persisted learner overview & admin metrics
    const myProg = await request(app)
      .get('/api/v1/me/progress')
      .set('Authorization', `Bearer ${learnerToken}`);
    expect(myProg.status).toBe(200);
    expect(myProg.body.data.summary.completedCoursesCount).toBe(1);

    const myAttempts = await request(app)
      .get('/api/v1/me/quiz-attempts')
      .set('Authorization', `Bearer ${learnerToken}`);
    expect(myAttempts.status).toBe(200);
    expect(myAttempts.body.data).toHaveLength(1);

    const metricsRes = await request(app)
      .get('/api/v1/admin/metrics')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(metricsRes.status).toBe(200);
    expect(metricsRes.body.data.totalEnrollments).toBe(1);
    expect(metricsRes.body.data.totalQuizAttempts).toBe(1);
  });
});
