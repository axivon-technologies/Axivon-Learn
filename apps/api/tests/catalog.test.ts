import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import { resetMemoryCatalog } from '../src/modules/courses/catalog.store';

describe('Public Catalog Domain Modules (/categories, /courses, /learning-paths, /projects)', () => {
  beforeEach(() => {
    resetMemoryCatalog();
  });

  it('lists only active categories ordered by sortOrder with published courseCount', async () => {
    const res = await request(app).get('/api/v1/categories');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.error).toBeNull();
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.map((c: { slug: string }) => c.slug)).toEqual([
      'ai-ml',
      'web-development',
      'cloud-devops'
    ]);

    // Inactive category ('legacy-mainframes') must never be exposed
    expect(res.body.data.some((c: { slug: string }) => c.slug === 'legacy-mainframes')).toBe(false);

    // Draft/archived courses must NOT inflate courseCount (Cloud & DevOps only has 1 draft course -> count 0)
    const cloudCat = res.body.data.find((c: { slug: string }) => c.slug === 'cloud-devops');
    expect(cloudCat?.courseCount).toBe(0);

    const webCat = res.body.data.find((c: { slug: string }) => c.slug === 'web-development');
    expect(webCat?.courseCount).toBe(1);
  });

  it('retrieves single active category by slug and returns 404 for inactive or missing category', async () => {
    const okRes = await request(app).get('/api/v1/categories/ai-ml');
    expect(okRes.status).toBe(200);
    expect(okRes.body.data).toMatchObject({
      name: 'AI & Machine Learning',
      slug: 'ai-ml',
      courseCount: 1
    });

    const inactiveRes = await request(app).get('/api/v1/categories/legacy-mainframes');
    expect(inactiveRes.status).toBe(404);
    expect(inactiveRes.body.error.code).toBe('NOT_FOUND');
  });

  it('lists only published courses with moduleCount, published lessonCount, and pagination meta (never exposing drafts/archived)', async () => {
    const res = await request(app).get('/api/v1/courses').query({ status: 'draft' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.meta).toEqual({
      page: 1,
      limit: 12,
      total: 2,
      totalPages: 1
    });

    const slugs = res.body.data.map((c: { slug: string }) => c.slug);
    expect(slugs).toContain('ai-ml-foundations');
    expect(slugs).toContain('full-stack-web-development');
    expect(slugs).not.toContain('unpublished-kubernetes-draft');
    expect(slugs).not.toContain('archived-angularjs-course');

    // AI course has 2 modules, 2 published lessons, and 1 draft lesson -> lessonCount must be 2
    const aiCourse = res.body.data.find((c: { slug: string }) => c.slug === 'ai-ml-foundations');
    expect(aiCourse.moduleCount).toBe(2);
    expect(aiCourse.lessonCount).toBe(2);
  });

  it('filters and paginates GET /api/v1/courses by category slug/name, level, search, and sort, and rejects invalid query params', async () => {
    const bySlug = await request(app).get('/api/v1/courses').query({ category: 'ai-ml' });
    expect(bySlug.status).toBe(200);
    expect(bySlug.body.data).toHaveLength(1);
    expect(bySlug.body.data[0].slug).toBe('ai-ml-foundations');

    const byLevel = await request(app).get('/api/v1/courses').query({ level: 'intermediate' });
    expect(byLevel.status).toBe(200);
    expect(byLevel.body.data).toHaveLength(1);
    expect(byLevel.body.data[0].slug).toBe('full-stack-web-development');

    const bySearch = await request(app).get('/api/v1/courses').query({ search: 'NumPy' });
    expect(bySearch.status).toBe(200);
    expect(bySearch.body.data).toHaveLength(1);
    expect(bySearch.body.data[0].slug).toBe('ai-ml-foundations');

    const paged = await request(app).get('/api/v1/courses').query({ sort: 'duration', page: 1, limit: 1 });
    expect(paged.status).toBe(200);
    expect(paged.body.data).toHaveLength(1);
    expect(paged.body.data[0].slug).toBe('ai-ml-foundations');
    expect(paged.body.meta).toEqual({
      page: 1,
      limit: 1,
      total: 2,
      totalPages: 2
    });

    const invalidLimit = await request(app).get('/api/v1/courses').query({ limit: 999 });
    expect(invalidLimit.status).toBe(400);
    expect(invalidLimit.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns published course detail with ordered modules and strictly published lessons on GET /api/v1/courses/:slug', async () => {
    const res = await request(app).get('/api/v1/courses/ai-ml-foundations');

    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({
      title: 'AI & Machine Learning Foundations',
      slug: 'ai-ml-foundations',
      status: 'published',
      moduleCount: 2,
      lessonCount: 2
    });
    expect(res.body.data.modules).toHaveLength(2);
    expect(res.body.data.modules[0].order).toBe(1);
    expect(res.body.data.modules[1].order).toBe(2);

    // Module 2 has 1 published lesson and 1 draft lesson -> only the published lesson may appear
    const mod2LessonSlugs = res.body.data.modules[1].lessons.map((l: { slug: string }) => l.slug);
    expect(mod2LessonSlugs).toEqual(['training-first-regression-model']);
    expect(mod2LessonSlugs).not.toContain('unpublished-draft-transformers');
  });

  it('rejects public requests for draft, archived, or unknown course slugs with 404 NOT_FOUND', async () => {
    const draftRes = await request(app).get('/api/v1/courses/unpublished-kubernetes-draft');
    expect(draftRes.status).toBe(404);
    expect(draftRes.body.error.code).toBe('NOT_FOUND');

    const archivedRes = await request(app).get('/api/v1/courses/archived-angularjs-course');
    expect(archivedRes.status).toBe(404);
    expect(archivedRes.body.error.code).toBe('NOT_FOUND');

    const unknownRes = await request(app).get('/api/v1/courses/non-existent-course');
    expect(unknownRes.status).toBe(404);
  });

  it('lists only published learning paths and strips unpublished courses from path course sequences', async () => {
    const res = await request(app).get('/api/v1/learning-paths');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    const pathSlugs = res.body.data.map((p: { slug: string }) => p.slug);
    expect(pathSlugs).toEqual(['ai-ml-path', 'full-stack-path']);
    expect(pathSlugs).not.toContain('draft-cloud-security-path');

    // ai-ml-path references [courseAI (published), courseDraft (draft)] -> only published course may be exposed
    const aiPath = res.body.data.find((p: { slug: string }) => p.slug === 'ai-ml-path');
    expect(aiPath.courseCount).toBe(1);
    expect(aiPath.courses).toHaveLength(1);
    expect(aiPath.courses[0].slug).toBe('ai-ml-foundations');
  });

  it('retrieves published learning path detail by slug and returns 404 for draft or missing paths', async () => {
    const okRes = await request(app).get('/api/v1/learning-paths/full-stack-path');
    expect(okRes.status).toBe(200);
    expect(okRes.body.data).toMatchObject({
      title: 'Full Stack Web Development',
      slug: 'full-stack-path',
      courseCount: 1
    });

    const draftRes = await request(app).get('/api/v1/learning-paths/draft-cloud-security-path');
    expect(draftRes.status).toBe(404);
    expect(draftRes.body.error.code).toBe('NOT_FOUND');
  });

  it('lists only published project briefs with filtering and pagination meta', async () => {
    const res = await request(app).get('/api/v1/projects');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.meta.total).toBe(2);
    expect(res.body.data.some((p: { slug: string }) => p.slug === 'draft-distributed-tracing-project')).toBe(
      false
    );

    const filtered = await request(app).get('/api/v1/projects').query({ category: 'ai-ml' });
    expect(filtered.status).toBe(200);
    expect(filtered.body.data).toHaveLength(1);
    expect(filtered.body.data[0].slug).toBe('customer-churn-prediction-pipeline');
  });

  it('retrieves published project brief detail by slug and returns 404 for draft or missing projects', async () => {
    const okRes = await request(app).get('/api/v1/projects/modular-edtech-rest-api');
    expect(okRes.status).toBe(200);
    expect(okRes.body.data).toMatchObject({
      title: 'Modular EdTech REST API Service',
      slug: 'modular-edtech-rest-api',
      durationHours: 12
    });
    expect(okRes.body.data.skills).toContain('TypeScript');
    expect(okRes.body.data.deliverables).toHaveLength(3);

    const draftRes = await request(app).get('/api/v1/projects/draft-distributed-tracing-project');
    expect(draftRes.status).toBe(404);
    expect(draftRes.body.error.code).toBe('NOT_FOUND');
  });
});
