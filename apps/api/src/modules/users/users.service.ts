import bcrypt from 'bcryptjs';
import { AppError } from '../../middleware/errorHandler';
import { UserRole } from '../../database/models/User';
import {
  SafeUserDTO,
  toSafeUserDTO,
  findUserByIdWithSecrets,
  updateUserRecordById
} from './user.store';

export async function getOwnUserProfile(userId: string): Promise<SafeUserDTO> {
  const user = await findUserByIdWithSecrets(userId);
  if (!user || !user.isActive) {
    throw new AppError('Account not found or inactive.', 401, undefined, 'UNAUTHORIZED');
  }
  return toSafeUserDTO(user);
}

export async function updateOwnUserProfile(
  userId: string,
  input: { name: string }
): Promise<SafeUserDTO> {
  const existing = await findUserByIdWithSecrets(userId);
  if (!existing || !existing.isActive) {
    throw new AppError('Account not found or inactive.', 401, undefined, 'UNAUTHORIZED');
  }

  const updated = await updateUserRecordById(userId, { name: input.name });
  if (!updated) {
    throw new AppError('User profile not found.', 404, undefined, 'NOT_FOUND');
  }
  return toSafeUserDTO(updated);
}

export async function changeOwnUserPassword(
  userId: string,
  input: { currentPassword: string; newPassword: string }
): Promise<{ message: string }> {
  const existing = await findUserByIdWithSecrets(userId);
  if (!existing || !existing.isActive) {
    throw new AppError('Account not found or inactive.', 401, undefined, 'UNAUTHORIZED');
  }

  const validCurrent = await bcrypt.compare(input.currentPassword, existing.passwordHash);
  if (!validCurrent) {
    throw new AppError('Current password is incorrect.', 401, undefined, 'UNAUTHORIZED');
  }

  const salt = await bcrypt.genSalt(10);
  const newPasswordHash = await bcrypt.hash(input.newPassword, salt);

  await updateUserRecordById(userId, {
    passwordHash: newPasswordHash,
    passwordResetTokenHash: null,
    passwordResetExpiresAt: null
  });

  return { message: 'Password updated successfully.' };
}

export async function getUserProfileById(
  requester: { id: string; role: UserRole },
  targetUserId: string
): Promise<SafeUserDTO> {
  // Enforce horizontal ownership: learners may only read their own user record; admins may read any
  if (requester.role !== 'admin' && requester.id !== targetUserId) {
    throw new AppError(
      'Access forbidden. You can only view your own user profile.',
      403,
      undefined,
      'FORBIDDEN'
    );
  }

  const target = await findUserByIdWithSecrets(targetUserId);
  if (!target) {
    throw new AppError('User not found.', 404, undefined, 'NOT_FOUND');
  }
  return toSafeUserDTO(target);
}
