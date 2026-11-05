import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
  keyPrefix?: string;
}

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Periodic cleanup of expired buckets (unref so test runners exit cleanly)
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}, 60_000);

if (typeof cleanupTimer.unref === 'function') {
  cleanupTimer.unref();
}

export function resetRateLimitBuckets(): void {
  buckets.clear();
}

export function createRateLimiter(options: RateLimitOptions) {
  const {
    windowMs,
    max,
    message = 'Too many requests. Please wait before trying again.',
    keyPrefix = 'global'
  } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    const clientIp = req.ip || req.socket?.remoteAddress || 'unknown';
    const key = `${keyPrefix}:${clientIp}`;
    const now = Date.now();

    let bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(key, bucket);
    }

    bucket.count += 1;
    const remaining = Math.max(0, max - bucket.count);
    const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));

    res.setHeader('X-RateLimit-Limit', String(max));
    res.setHeader('X-RateLimit-Remaining', String(remaining));
    res.setHeader('X-RateLimit-Reset', String(Math.ceil(bucket.resetAt / 1000)));

    if (bucket.count > max) {
      res.setHeader('Retry-After', String(retryAfterSeconds));
      return next(new AppError(message, 429, undefined, 'RATE_LIMITED'));
    }

    next();
  };
}

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 25,
  keyPrefix: 'auth',
  message: 'Too many authentication attempts. Please try again in 15 minutes.'
});

export default createRateLimiter;
