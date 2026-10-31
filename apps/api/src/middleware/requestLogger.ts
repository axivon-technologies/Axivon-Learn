import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    // Strip sensitive passwords, tokens, or hashes from log records
    const safeUrl = req.originalUrl.split('?')[0];
    console.log(`[API] ${req.method} ${safeUrl} -> ${res.statusCode} (${duration}ms)`);
  });

  next();
}

export default requestLogger;
