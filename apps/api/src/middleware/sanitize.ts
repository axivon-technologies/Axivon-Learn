import { Request, Response, NextFunction } from 'express';

function sanitizeValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
    const clean: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      // Strip MongoDB query operators ($gt, $ne, $where, etc.) and dotted path keys
      if (key.startsWith('$') || key.includes('.')) {
        continue;
      }
      clean[key] = sanitizeValue(nested);
    }
    return clean;
  }
  return value;
}

/**
 * Protects Express routes against NoSQL operator injection in body, query, and params.
 */
export function sanitizeInput(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeValue(req.query) as Request['query'];
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeValue(req.params) as Request['params'];
  }
  next();
}

export default sanitizeInput;
