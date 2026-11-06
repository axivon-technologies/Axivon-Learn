import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import { resetRateLimitBuckets } from '../src/middleware/rateLimit';
import { resetMemoryUsers, setMemoryUserActiveState } from '../src/modules/users/user.store';

describe('Authentication & Users Domain Modules (/api/v1/auth & /api/v1/users)', () => {
  beforeEach(() => {
    resetRateLimitBuckets();
    resetMemoryUsers();
  });

  it('registers a new learner, normalizes email, sets HttpOnly cookies, and hides passwordHash', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: '  Vinay Partap  ',
        email: '  Vinay.Partap@Example.COM ',
        password: 'StrongPassword123!'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.error).toBeNull();
    expect(res.body.data.user).toMatchObject({
      name: 'Vinay Partap',
      email: 'vinay.partap@example.com',
      role: 'learner',
      isActive: true
    });
    expect(res.body.data.token).toBeTypeOf('string');
    expect(JSON.stringify(res.body)).not.toMatch(/passwordHash/i);

    const setCookies = res.headers['set-cookie'];
    expect(setCookies).toBeDefined();
    const cookieJoined = Array.isArray(setCookies) ? setCookies.join(';') : String(setCookies);
    expect(cookieJoined).toContain('access_token=');
    expect(cookieJoined).toContain('HttpOnly');
  });

  it('rejects duplicate email registration (case-insensitive) with 409 CONFLICT', async () => {
    await request(app).post('/api/v1/auth/register').send({
      name: 'First Learner',
      email: 'duplicate@example.com',
      password: 'Password123!'
    });

    const dup = await request(app).post('/api/v1/auth/register').send({
      name: 'Second Learner',
      email: 'DUPLICATE@example.com',
      password: 'Password456!'
    });

    expect(dup.status).toBe(409);
    expect(dup.body).toMatchObject({
      success: false,
      data: null,
      error: {
        code: 'CONFLICT',
        statusCode: 409
      }
    });
  });

  it('authenticates valid credentials and rejects wrong passwords with safe 401 UNAUTHORIZED', async () => {
    const okLogin = await request(app).post('/api/v1/auth/login').send({
      email: 'learner@axivon.local',
      password: 'AxivonLearner2026!'
    });

    expect(okLogin.status).toBe(200);
    expect(okLogin.body.data.user.email).toBe('learner@axivon.local');
    expect(okLogin.body.data.token).toBeTypeOf('string');

    const badLogin = await request(app).post('/api/v1/auth/login').send({
      email: 'learner@axivon.local',
      password: 'WrongPassword999'
    });

    expect(badLogin.status).toBe(401);
    expect(badLogin.body).toMatchObject({
      success: false,
      data: null,
      error: {
        code: 'UNAUTHORIZED',
        statusCode: 401
      }
    });
  });

  it('blocks deactivated accounts from logging in or calling /auth/me', async () => {
    const reg = await request(app).post('/api/v1/auth/register').send({
      name: 'Suspended User',
      email: 'suspended@example.com',
      password: 'Password123!'
    });

    const userId = reg.body.data.user.id;
    const token = reg.body.data.token;

    setMemoryUserActiveState(userId, false);

    const meRes = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(meRes.status).toBe(401);

    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'suspended@example.com',
      password: 'Password123!'
    });
    expect(loginRes.status).toBe(401);
  });

  it('supports /auth/me via both Bearer token and access_token cookie, and clears cookies on /auth/logout', async () => {
    const agent = request.agent(app);

    const login = await agent.post('/api/v1/auth/login').send({
      email: 'learner@axivon.local',
      password: 'AxivonLearner2026!'
    });
    expect(login.status).toBe(200);

    // Cookie-authenticated request
    const meCookie = await agent.get('/api/v1/auth/me');
    expect(meCookie.status).toBe(200);
    expect(meCookie.body.data.user.email).toBe('learner@axivon.local');

    // Logout clears cookie
    const logout = await agent.post('/api/v1/auth/logout');
    expect(logout.status).toBe(200);

    const afterLogout = await agent.get('/api/v1/auth/me');
    expect(afterLogout.status).toBe(401);
  });

  it('refreshes access tokens via /auth/refresh and blocks refresh tokens on regular protected routes', async () => {
    const agent = request.agent(app);

    const login = await agent.post('/api/v1/auth/login').send({
      email: 'learner@axivon.local',
      password: 'AxivonLearner2026!'
    });
    expect(login.status).toBe(200);

    // Extract refresh_token value from Set-Cookie to verify it cannot be used as Bearer access token
    const rawCookies: string[] = ([] as string[]).concat(login.headers['set-cookie'] || []);
    const refreshCookie = rawCookies.find((c) => c.startsWith('refresh_token='));
    expect(refreshCookie).toBeDefined();
    const refreshJwt = refreshCookie!.split(';')[0].split('=')[1];

    const misuseRes = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${refreshJwt}`);
    expect(misuseRes.status).toBe(401);

    const refreshRes = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: refreshJwt });
    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.data.token).toBeTypeOf('string');
  });

  it('completes forgot-password and single-use reset-password flow securely', async () => {
    const forgotRes = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: 'learner@axivon.local' });

    expect(forgotRes.status).toBe(200);
    const resetToken = forgotRes.body.data.devResetToken;
    expect(resetToken).toBeTypeOf('string');

    const resetRes = await request(app).post('/api/v1/auth/reset-password').send({
      token: resetToken,
      password: 'BrandNewPassword2026!'
    });
    expect(resetRes.status).toBe(200);

    // Token must be single-use: replaying the same token fails with 400
    const replayRes = await request(app).post('/api/v1/auth/reset-password').send({
      token: resetToken,
      password: 'AnotherPassword2026!'
    });
    expect(replayRes.status).toBe(400);

    // Old password rejected, new password succeeds
    const oldLogin = await request(app).post('/api/v1/auth/login').send({
      email: 'learner@axivon.local',
      password: 'AxivonLearner2026!'
    });
    expect(oldLogin.status).toBe(401);

    const newLogin = await request(app).post('/api/v1/auth/login').send({
      email: 'learner@axivon.local',
      password: 'BrandNewPassword2026!'
    });
    expect(newLogin.status).toBe(200);
  });

  it('allows learners to update own name via PATCH /users/me while rejecting role self-escalation', async () => {
    const login = await request(app).post('/api/v1/auth/login').send({
      email: 'learner@axivon.local',
      password: 'AxivonLearner2026!'
    });
    const token = login.body.data.token;

    // Attempt to escalate role to admin via PATCH /users/me must fail validation (400)
    const escalateAttempt = await request(app)
      .patch('/api/v1/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Alex Updated', role: 'admin' });
    expect(escalateAttempt.status).toBe(400);

    // Valid name update succeeds and preserves learner role
    const validPatch = await request(app)
      .patch('/api/v1/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Alex Johnson Updated' });

    expect(validPatch.status).toBe(200);
    expect(validPatch.body.data.user).toMatchObject({
      name: 'Alex Johnson Updated',
      role: 'learner'
    });
  });

  it('enforces horizontal ownership on GET /users/:userId (learner -> 403, admin -> 200)', async () => {
    const regB = await request(app).post('/api/v1/auth/register').send({
      name: 'Learner Two',
      email: 'learner2@example.com',
      password: 'Password123!'
    });
    const learnerBId = regB.body.data.user.id;

    const loginLearnerA = await request(app).post('/api/v1/auth/login').send({
      email: 'learner@axivon.local',
      password: 'AxivonLearner2026!'
    });
    const learnerAToken = loginLearnerA.body.data.token;

    // Learner A trying to view Learner B's profile -> 403 FORBIDDEN
    const forbiddenRes = await request(app)
      .get(`/api/v1/users/${learnerBId}`)
      .set('Authorization', `Bearer ${learnerAToken}`);
    expect(forbiddenRes.status).toBe(403);
    expect(forbiddenRes.body.error.code).toBe('FORBIDDEN');

    // Admin viewing Learner B's profile -> 200 OK
    const loginAdmin = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@axivon.local',
      password: 'AxivonAdmin2026!'
    });
    const adminToken = loginAdmin.body.data.token;

    const adminViewRes = await request(app)
      .get(`/api/v1/users/${learnerBId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(adminViewRes.status).toBe(200);
    expect(adminViewRes.body.data.user.email).toBe('learner2@example.com');
  });

  it('validates and updates password via POST /users/me/change-password', async () => {
    const login = await request(app).post('/api/v1/auth/login').send({
      email: 'learner@axivon.local',
      password: 'AxivonLearner2026!'
    });
    const token = login.body.data.token;

    const wrongCurrent = await request(app)
      .post('/api/v1/users/me/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'WrongCurrentPassword', newPassword: 'UpdatedPassword2026!' });
    expect(wrongCurrent.status).toBe(401);

    const okChange = await request(app)
      .post('/api/v1/users/me/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'AxivonLearner2026!', newPassword: 'UpdatedPassword2026!' });
    expect(okChange.status).toBe(200);

    const reLogin = await request(app).post('/api/v1/auth/login').send({
      email: 'learner@axivon.local',
      password: 'UpdatedPassword2026!'
    });
    expect(reLogin.status).toBe(200);
  });
});
