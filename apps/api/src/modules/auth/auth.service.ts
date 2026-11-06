import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { AppError } from '../../middleware/errorHandler';
import {
  SafeUserDTO,
  toSafeUserDTO,
  findUserByEmailWithSecrets,
  findUserByIdWithSecrets,
  findUserByResetTokenHash,
  createUserRecord,
  updateUserRecordById
} from '../users/user.store';

export interface AuthSessionResult {
  user: SafeUserDTO;
  token: string;
  refreshToken: string;
}

function hashResetToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

function issueTokens(user: SafeUserDTO): { token: string; refreshToken: string } {
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, type: 'access' },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as any }
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role, type: 'refresh' },
    env.REFRESH_TOKEN_SECRET,
    { expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as any }
  );

  return { token, refreshToken };
}

export async function registerLearner(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthSessionResult> {
  const normalizedEmail = input.email.trim().toLowerCase();
  const existing = await findUserByEmailWithSecrets(normalizedEmail);
  if (existing) {
    throw new AppError(
      'An account with this email address already exists.',
      409,
      undefined,
      'CONFLICT'
    );
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(input.password, salt);

  const created = await createUserRecord({
    name: input.name,
    email: normalizedEmail,
    passwordHash,
    role: 'learner'
  });

  const safeUser = toSafeUserDTO(created);
  const { token, refreshToken } = issueTokens(safeUser);
  return { user: safeUser, token, refreshToken };
}

export async function authenticateCredentials(input: {
  email: string;
  password: string;
}): Promise<AuthSessionResult> {
  const normalizedEmail = input.email.trim().toLowerCase();
  const user = await findUserByEmailWithSecrets(normalizedEmail);

  if (!user || !user.isActive) {
    throw new AppError('Invalid email or password.', 401, undefined, 'UNAUTHORIZED');
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordMatches) {
    throw new AppError('Invalid email or password.', 401, undefined, 'UNAUTHORIZED');
  }

  const safeUser = toSafeUserDTO(user);
  const { token, refreshToken } = issueTokens(safeUser);
  return { user: safeUser, token, refreshToken };
}

export async function refreshAccessToken(rawRefreshToken?: string): Promise<AuthSessionResult> {
  if (!rawRefreshToken) {
    throw new AppError('Refresh token required.', 401, undefined, 'UNAUTHORIZED');
  }

  let decoded: { id?: string; type?: string };
  try {
    decoded = jwt.verify(rawRefreshToken, env.REFRESH_TOKEN_SECRET) as {
      id?: string;
      type?: string;
    };
  } catch (_err) {
    throw new AppError('Invalid or expired refresh token.', 401, undefined, 'UNAUTHORIZED');
  }

  if (!decoded.id || decoded.type !== 'refresh') {
    throw new AppError('Invalid refresh token payload.', 401, undefined, 'UNAUTHORIZED');
  }

  const user = await findUserByIdWithSecrets(decoded.id);
  if (!user || !user.isActive) {
    throw new AppError('Account not found or inactive.', 401, undefined, 'UNAUTHORIZED');
  }

  const safeUser = toSafeUserDTO(user);
  const { token, refreshToken } = issueTokens(safeUser);
  return { user: safeUser, token, refreshToken };
}

export async function getAuthenticatedProfile(userId: string): Promise<SafeUserDTO> {
  const user = await findUserByIdWithSecrets(userId);
  if (!user || !user.isActive) {
    throw new AppError('Account not found or inactive.', 401, undefined, 'UNAUTHORIZED');
  }
  return toSafeUserDTO(user);
}

export async function requestPasswordReset(rawEmail: string): Promise<{
  message: string;
  devResetToken?: string;
}> {
  const genericMessage =
    'If an active account exists for this email, password reset instructions have been generated.';
  const normalizedEmail = rawEmail.trim().toLowerCase();
  const user = await findUserByEmailWithSecrets(normalizedEmail);

  if (!user || !user.isActive) {
    return { message: genericMessage };
  }

  const plainToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashResetToken(plainToken);
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

  await updateUserRecordById(user.id, {
    passwordResetTokenHash: tokenHash,
    passwordResetExpiresAt: expiresAt
  });

  if (env.NODE_ENV !== 'production') {
    return {
      message: genericMessage,
      devResetToken: plainToken
    };
  }

  return { message: genericMessage };
}

export async function confirmPasswordReset(input: {
  token: string;
  password: string;
}): Promise<{ message: string }> {
  const tokenHash = hashResetToken(input.token.trim());
  const user = await findUserByResetTokenHash(tokenHash);

  if (!user || !user.isActive) {
    throw new AppError(
      'Invalid or expired password reset token.',
      400,
      undefined,
      'VALIDATION_ERROR'
    );
  }

  const salt = await bcrypt.genSalt(10);
  const newPasswordHash = await bcrypt.hash(input.password, salt);

  await updateUserRecordById(user.id, {
    passwordHash: newPasswordHash,
    passwordResetTokenHash: null,
    passwordResetExpiresAt: null
  });

  return { message: 'Password has been reset successfully. You may now sign in.' };
}
