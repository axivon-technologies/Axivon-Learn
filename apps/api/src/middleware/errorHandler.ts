import { Request, Response, NextFunction } from 'express';

export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'INVALID_ID'
  | 'INVALID_JSON'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'DUPLICATE_RESOURCE'
  | 'RATE_LIMITED'
  | 'SERVICE_UNAVAILABLE'
  | 'INTERNAL_ERROR';

function defaultCodeForStatus(statusCode: number): ErrorCode {
  switch (statusCode) {
    case 400:
      return 'VALIDATION_ERROR';
    case 401:
      return 'UNAUTHORIZED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 409:
      return 'CONFLICT';
    case 429:
      return 'RATE_LIMITED';
    case 503:
      return 'SERVICE_UNAVAILABLE';
    default:
      return 'INTERNAL_ERROR';
  }
}

export class AppError extends Error {
  public statusCode: number;
  public details?: unknown;
  public code: ErrorCode;

  constructor(message: string, statusCode = 500, details?: unknown, code?: ErrorCode) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.code = code || defaultCodeForStatus(statusCode);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Handle malformed JSON payloads from express.json()
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      success: false,
      data: null,
      error: {
        code: 'INVALID_JSON',
        message: 'Malformed JSON request body.',
        statusCode: 400
      }
    });
    return;
  }

  // Handle Mongoose invalid ObjectId CastError safely
  if (err?.name === 'CastError') {
    res.status(400).json({
      success: false,
      data: null,
      error: {
        code: 'INVALID_ID',
        message: `Invalid identifier format for '${err.path || 'id'}'.`,
        statusCode: 400
      }
    });
    return;
  }

  // Handle MongoDB unique index conflict (E11000) safely without leaking internal details
  if (err?.code === 11000) {
    res.status(409).json({
      success: false,
      data: null,
      error: {
        code: 'DUPLICATE_RESOURCE',
        message: 'A record with the provided unique value already exists.',
        statusCode: 409
      }
    });
    return;
  }

  const statusCode: number = err?.statusCode || (err?.name === 'ValidationError' ? 400 : 500);
  const code: ErrorCode = err?.code && typeof err.code === 'string'
    ? (err.code as ErrorCode)
    : defaultCodeForStatus(statusCode);
  const message: string =
    statusCode >= 500 && process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err?.message || 'Internal Server Error';

  // Never leak internal stack traces or database connection details in responses
  res.status(statusCode).json({
    success: false,
    data: null,
    error: {
      code,
      message,
      statusCode,
      ...(err?.details !== undefined ? { details: err.details } : {})
    }
  });
}

export default errorHandler;
