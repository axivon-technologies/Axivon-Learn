import { Request, Response, NextFunction } from 'express';
import { env } from '../../config/env';
import { sendSuccess } from '../../shared/response';
import {
  registerLearner,
  authenticateCredentials,
  refreshAccessToken,
  getAuthenticatedProfile,
  requestPasswordReset,
  confirmPasswordReset
} from './auth.service';

const ACCESS_COOKIE_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 1 day
const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function attachAuthCookies(res: Response, token: string, refreshToken: string): void {
  const isProd = env.NODE_ENV === 'production';

  res.cookie('access_token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: ACCESS_COOKIE_MAX_AGE_MS
  });

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: `${env.API_PREFIX}/auth`,
    maxAge: REFRESH_COOKIE_MAX_AGE_MS
  });
}

export async function registerHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { user, token, refreshToken } = await registerLearner(req.body);
    attachAuthCookies(res, token, refreshToken);
    sendSuccess(res, { user, token }, 201);
  } catch (err) {
    next(err);
  }
}

export async function loginHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { user, token, refreshToken } = await authenticateCredentials(req.body);
    attachAuthCookies(res, token, refreshToken);
    sendSuccess(res, { user, token }, 200);
  } catch (err) {
    next(err);
  }
}

export async function refreshHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const incomingRefresh = req.cookies?.refresh_token || req.body?.refreshToken;
    const { user, token, refreshToken } = await refreshAccessToken(incomingRefresh);
    attachAuthCookies(res, token, refreshToken);
    sendSuccess(res, { user, token }, 200);
  } catch (err) {
    next(err);
  }
}

export function logoutHandler(_req: Request, res: Response): void {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token', { path: `${env.API_PREFIX}/auth` });
  res.status(200).json({
    success: true,
    data: { message: 'Signed out successfully.' },
    error: null,
    message: 'Signed out successfully.'
  });
}

export async function currentUserHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await getAuthenticatedProfile(req.user!.id);
    sendSuccess(res, { user }, 200);
  } catch (err) {
    next(err);
  }
}

export async function forgotPasswordHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await requestPasswordReset(req.body.email);
    sendSuccess(res, result, 200);
  } catch (err) {
    next(err);
  }
}

export async function resetPasswordHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await confirmPasswordReset(req.body);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token', { path: `${env.API_PREFIX}/auth` });
    sendSuccess(res, result, 200);
  } catch (err) {
    next(err);
  }
}
