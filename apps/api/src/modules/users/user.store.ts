import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { isDatabaseConnected } from '../../database/connection';
import { User, UserRole } from '../../database/models/User';
import { isValidObjectId } from '../../utils/objectId';

export interface StoredUserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  passwordResetTokenHash: string | null;
  passwordResetExpiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SafeUserDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function toSafeUserDTO(record: {
  id?: string;
  _id?: unknown;
  name: string;
  email: string;
  role: UserRole;
  isActive?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}): SafeUserDTO {
  const id = record.id || String(record._id);
  const created = record.createdAt ? new Date(record.createdAt).toISOString() : new Date().toISOString();
  const updated = record.updatedAt ? new Date(record.updatedAt).toISOString() : created;
  return {
    id,
    name: record.name,
    email: record.email,
    role: record.role,
    isActive: record.isActive !== undefined ? record.isActive : true,
    createdAt: created,
    updatedAt: updated
  };
}

// -----------------------------------------------------------------------------
// Fallback In-Memory Store (Used ONLY when MongoDB is disconnected in tests/CI)
// Uses real bcrypt hashes so security behavior matches MongoDB 1:1.
// -----------------------------------------------------------------------------
const memoryUsersById = new Map<string, StoredUserRecord>();

function ensureDefaultMemoryUsers(): void {
  if (memoryUsersById.size > 0) return;
  const now = new Date();
  const adminId = '507f1f77bcf86cd799439011';
  const learnerId = '507f1f77bcf86cd799439012';

  memoryUsersById.set(adminId, {
    id: adminId,
    name: 'Platform Administrator',
    email: 'admin@axivon.local',
    passwordHash: bcrypt.hashSync('AxivonAdmin2026!', 10),
    role: 'admin',
    isActive: true,
    passwordResetTokenHash: null,
    passwordResetExpiresAt: null,
    createdAt: now,
    updatedAt: now
  });

  memoryUsersById.set(learnerId, {
    id: learnerId,
    name: 'Alex Johnson',
    email: 'learner@axivon.local',
    passwordHash: bcrypt.hashSync('AxivonLearner2026!', 10),
    role: 'learner',
    isActive: true,
    passwordResetTokenHash: null,
    passwordResetExpiresAt: null,
    createdAt: now,
    updatedAt: now
  });
}

export function resetMemoryUsers(): void {
  memoryUsersById.clear();
  ensureDefaultMemoryUsers();
}

export function setMemoryUserActiveState(userId: string, isActive: boolean): void {
  ensureDefaultMemoryUsers();
  const existing = memoryUsersById.get(userId);
  if (existing) {
    existing.isActive = isActive;
    existing.updatedAt = new Date();
  }
}

export async function findUserByEmailWithSecrets(rawEmail: string): Promise<StoredUserRecord | null> {
  const email = rawEmail.trim().toLowerCase();

  if (isDatabaseConnected()) {
    const doc = await User.findOne({ email })
      .select('+passwordHash +passwordResetTokenHash +passwordResetExpiresAt')
      .lean();
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      passwordHash: doc.passwordHash,
      role: doc.role,
      isActive: doc.isActive,
      passwordResetTokenHash: doc.passwordResetTokenHash ?? null,
      passwordResetExpiresAt: doc.passwordResetExpiresAt ?? null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  ensureDefaultMemoryUsers();
  for (const user of memoryUsersById.values()) {
    if (user.email === email) {
      return { ...user };
    }
  }
  return null;
}

export async function findUserByIdWithSecrets(userId: string): Promise<StoredUserRecord | null> {
  if (isDatabaseConnected()) {
    if (!isValidObjectId(userId)) return null;
    const doc = await User.findById(userId)
      .select('+passwordHash +passwordResetTokenHash +passwordResetExpiresAt')
      .lean();
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      passwordHash: doc.passwordHash,
      role: doc.role,
      isActive: doc.isActive,
      passwordResetTokenHash: doc.passwordResetTokenHash ?? null,
      passwordResetExpiresAt: doc.passwordResetExpiresAt ?? null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  ensureDefaultMemoryUsers();
  const user = memoryUsersById.get(userId);
  return user ? { ...user } : null;
}

export async function findUserByResetTokenHash(tokenHash: string): Promise<StoredUserRecord | null> {
  const now = new Date();

  if (isDatabaseConnected()) {
    const doc = await User.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetExpiresAt: { $gt: now }
    })
      .select('+passwordHash +passwordResetTokenHash +passwordResetExpiresAt')
      .lean();
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      passwordHash: doc.passwordHash,
      role: doc.role,
      isActive: doc.isActive,
      passwordResetTokenHash: doc.passwordResetTokenHash ?? null,
      passwordResetExpiresAt: doc.passwordResetExpiresAt ?? null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  ensureDefaultMemoryUsers();
  for (const user of memoryUsersById.values()) {
    if (
      user.passwordResetTokenHash === tokenHash &&
      user.passwordResetExpiresAt &&
      user.passwordResetExpiresAt.getTime() > now.getTime()
    ) {
      return { ...user };
    }
  }
  return null;
}

export async function createUserRecord(input: {
  name: string;
  email: string;
  passwordHash: string;
  role?: UserRole;
}): Promise<StoredUserRecord> {
  const normalizedEmail = input.email.trim().toLowerCase();
  const role: UserRole = input.role || 'learner';

  if (isDatabaseConnected()) {
    const created = await User.create({
      name: input.name.trim(),
      email: normalizedEmail,
      passwordHash: input.passwordHash,
      role,
      isActive: true
    });
    return {
      id: created._id.toString(),
      name: created.name,
      email: created.email,
      passwordHash: created.passwordHash,
      role: created.role,
      isActive: created.isActive,
      passwordResetTokenHash: null,
      passwordResetExpiresAt: null,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt
    };
  }

  ensureDefaultMemoryUsers();
  const id = new mongoose.Types.ObjectId().toString();
  const now = new Date();
  const record: StoredUserRecord = {
    id,
    name: input.name.trim(),
    email: normalizedEmail,
    passwordHash: input.passwordHash,
    role,
    isActive: true,
    passwordResetTokenHash: null,
    passwordResetExpiresAt: null,
    createdAt: now,
    updatedAt: now
  };
  memoryUsersById.set(id, record);
  return { ...record };
}

export async function updateUserRecordById(
  userId: string,
  patch: Partial<{
    name: string;
    passwordHash: string;
    role: UserRole;
    isActive: boolean;
    passwordResetTokenHash: string | null;
    passwordResetExpiresAt: Date | null;
  }>
): Promise<StoredUserRecord | null> {
  if (isDatabaseConnected()) {
    if (!isValidObjectId(userId)) return null;
    const updated = await User.findByIdAndUpdate(userId, { $set: patch }, { new: true })
      .select('+passwordHash +passwordResetTokenHash +passwordResetExpiresAt')
      .lean();
    if (!updated) return null;
    return {
      id: updated._id.toString(),
      name: updated.name,
      email: updated.email,
      passwordHash: updated.passwordHash,
      role: updated.role,
      isActive: updated.isActive,
      passwordResetTokenHash: updated.passwordResetTokenHash ?? null,
      passwordResetExpiresAt: updated.passwordResetExpiresAt ?? null,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt
    };
  }

  ensureDefaultMemoryUsers();
  const existing = memoryUsersById.get(userId);
  if (!existing) return null;

  if (patch.name !== undefined) existing.name = patch.name.trim();
  if (patch.passwordHash !== undefined) existing.passwordHash = patch.passwordHash;
  if (patch.role !== undefined) existing.role = patch.role;
  if (patch.isActive !== undefined) existing.isActive = patch.isActive;
  if (patch.passwordResetTokenHash !== undefined) {
    existing.passwordResetTokenHash = patch.passwordResetTokenHash;
  }
  if (patch.passwordResetExpiresAt !== undefined) {
    existing.passwordResetExpiresAt = patch.passwordResetExpiresAt;
  }
  existing.updatedAt = new Date();
  return { ...existing };
}

export async function countPlatformUsers(): Promise<{ totalUsers: number; totalLearners: number }> {
  if (isDatabaseConnected()) {
    const [totalUsers, totalLearners] = await Promise.all([
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: true, role: 'learner' })
    ]);
    return { totalUsers, totalLearners };
  }

  ensureDefaultMemoryUsers();
  const active = Array.from(memoryUsersById.values()).filter((u) => u.isActive);
  return {
    totalUsers: active.length,
    totalLearners: active.filter((u) => u.role === 'learner').length
  };
}

