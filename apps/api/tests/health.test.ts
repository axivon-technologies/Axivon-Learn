import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';

describe('GET /api/v1/health', () => {
  it('should return 200 with status healthy, uptime, and database indicator', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'healthy');
    expect(res.body).toHaveProperty('uptime');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('environment');
    expect(res.body).toHaveProperty('database');

    // Security check: ensure no passwords, secrets, or internal connection strings leaked
    expect(JSON.stringify(res.body)).not.toMatch(/mongodb:\/\//);
    expect(JSON.stringify(res.body)).not.toMatch(/password/i);
    expect(JSON.stringify(res.body)).not.toMatch(/secret/i);
  });
});
