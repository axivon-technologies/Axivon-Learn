import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';

describe('API 404 Behavior', () => {
  it('should return 404 structured error for undefined endpoints', async () => {
    const res = await request(app).get('/api/v1/non-existent-route');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.error).toHaveProperty('message', 'API endpoint not found.');
    expect(res.body.error).toHaveProperty('statusCode', 404);
  });
});
