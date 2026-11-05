import mongoose from 'mongoose';
import { AppError } from '../middleware/errorHandler';

export function isValidObjectId(value: unknown): value is string {
  return typeof value === 'string' && mongoose.Types.ObjectId.isValid(value) && String(new mongoose.Types.ObjectId(value)) === value;
}

export function assertValidObjectId(value: unknown, resourceLabel = 'Resource'): string {
  if (!isValidObjectId(value)) {
    throw new AppError(`Invalid ${resourceLabel} identifier.`, 400, undefined, 'INVALID_ID');
  }
  return value;
}
