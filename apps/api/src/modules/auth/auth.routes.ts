import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authRateLimiter } from '../../middleware/rateLimit';
import { validate } from '../../middleware/validate';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenBodySchema
} from './auth.validators';
import {
  registerHandler,
  loginHandler,
  refreshHandler,
  logoutHandler,
  currentUserHandler,
  forgotPasswordHandler,
  resetPasswordHandler
} from './auth.controller';

export const authRouter = Router();

authRouter.post('/register', authRateLimiter, validate(registerSchema), registerHandler);
authRouter.post('/login', authRateLimiter, validate(loginSchema), loginHandler);
authRouter.post('/refresh', authRateLimiter, validate(refreshTokenBodySchema), refreshHandler);
authRouter.post('/logout', logoutHandler);
authRouter.get('/me', authenticate, currentUserHandler);
authRouter.post(
  '/forgot-password',
  authRateLimiter,
  validate(forgotPasswordSchema),
  forgotPasswordHandler
);
authRouter.post(
  '/reset-password',
  authRateLimiter,
  validate(resetPasswordSchema),
  resetPasswordHandler
);

export default authRouter;
