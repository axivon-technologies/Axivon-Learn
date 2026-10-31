import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';

describe('POST /api/v1/auth/register Validation', () => {
  it('should return 400 when required fields are missing or invalid', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'not-an-email', password: 'short' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.error).toHaveProperty('message', 'Request validation failed.');
    expect(Array.isArray(res.body.error.details)).toBe(true);
  });
});
