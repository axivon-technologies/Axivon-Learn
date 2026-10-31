import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export function authorize(allowedRoles: ('visitor' | 'learner' | 'admin')[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required to verify permissions.', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access forbidden. Role '${req.user.role}' lacks permission for this administrative operation.`,
          403
        )
      );
    }

    next();
  };
}

export default authorize;
