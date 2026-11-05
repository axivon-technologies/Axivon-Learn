import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from './errorHandler';

export interface RequestValidationSchemas {
  body?: ZodSchema<any>;
  query?: ZodSchema<any>;
  params?: ZodSchema<any>;
}

function formatZodIssues(err: ZodError) {
  return err.issues.map((i) => ({
    field: i.path.join('.'),
    message: i.message
  }));
}

export function validate(schema: ZodSchema<any>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err: any) {
      if (err instanceof ZodError) {
        return next(new AppError('Request validation failed.', 400, formatZodIssues(err), 'VALIDATION_ERROR'));
      }
      next(err);
    }
  };
}

export function validateRequest(schemas: RequestValidationSchemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      next();
    } catch (err: any) {
      if (err instanceof ZodError) {
        return next(new AppError('Request validation failed.', 400, formatZodIssues(err), 'VALIDATION_ERROR'));
      }
      next(err);
    }
  };
}

export default validate;
