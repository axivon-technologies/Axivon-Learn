import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../src/app';
import { sanitizeInput } from '../src/middleware/sanitize';
import { createRateLimiter, resetRateLimitBuckets } from '../src/middleware/rateLimit';
import { errorHandler } from '../src/middleware/errorHandler';
import { LessonProgress } from '../src/database/models/LessonProgress';

describe('Backend Security & Foundation Controls', () => {
  beforeEach(() => {
    resetRateLimitBuckets();
  });

  it('strips MongoDB operator injection ($gt, $ne, dotted keys) from request payloads', async () => {
    const testApp = express();
    testApp.use(express.json());
    testApp.use(sanitizeInput);
    testApp.post('/echo', (req, res) => {
      res.status(200).json({ body: req.body, query: req.query });
    });

    const res = await request(testApp)
      .post('/echo?$where=malicious')
      .send({
        email: { $gt: '', safe: 'ok' },
        'profile.role': 'admin',
        name: 'Vinay'
      });

    expect(res.status).toBe(200);
    expect(res.body.body).toEqual({
      email: { safe: 'ok' },
      name: 'Vinay'
    });
    expect(res.body.query).toEqual({});
  });

  it('enforces rate limiting with 429 RATE_LIMITED and Retry-After header', async () => {
    const testApp = express();
    const strictLimiter = createRateLimiter({
      windowMs: 60_000,
      max: 2,
      keyPrefix: 'test-strict',
      message: 'Rate limit exceeded in test.'
    });
    testApp.get('/limited', strictLimiter, (_req, res) => {
      res.status(200).json({ success: true });
    });
    testApp.use(errorHandler);

    const first = await request(testApp).get('/limited');
    const second = await request(testApp).get('/limited');
    const third = await request(testApp).get('/limited');

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(third.status).toBe(429);
    expect(third.headers['retry-after']).toBeDefined();
    expect(third.body).toMatchObject({
      success: false,
      data: null,
      error: {
        code: 'RATE_LIMITED',
        statusCode: 429
      }
    });
  });

  it('safely handles regex special characters in GET /api/v1/courses?category= without crashing', async () => {
    const res = await request(app).get('/api/v1/courses').query({ category: '[invalid(regex*+' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('error', null);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('returns standardized error envelope with data: null and error.code on 404 routes', async () => {
    const res = await request(app).get('/api/v1/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      data: null,
      error: {
        code: 'NOT_FOUND',
        message: 'API endpoint not found.',
        statusCode: 404
      }
    });
  });

  it('defines LessonProgress schema with unique compound index on userId + lessonId', () => {
    const indexes = LessonProgress.schema.indexes();
    const hasUniqueUserLessonIndex = indexes.some(
      ([fields, opts]) => fields.userId === 1 && fields.lessonId === 1 && opts?.unique === true
    );
    expect(hasUniqueUserLessonIndex).toBe(true);

    const doc = new LessonProgress({
      userId: new mongoose.Types.ObjectId(),
      courseId: new mongoose.Types.ObjectId(),
      lessonId: new mongoose.Types.ObjectId(),
      status: 'completed',
      completedAt: new Date()
    });
    const validationErr = doc.validateSync();
    expect(validationErr).toBeUndefined();
  });
});
