import { Response } from 'express';

export interface ApiSuccessEnvelope<T> {
  success: true;
  data: T;
  error: null;
  meta?: Record<string, unknown>;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode = 200,
  meta?: Record<string, unknown>
): Response {
  const payload: ApiSuccessEnvelope<T> = {
    success: true,
    data,
    error: null
  };
  if (meta) {
    payload.meta = meta;
  }
  return res.status(statusCode).json(payload);
}
