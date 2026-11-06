import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authRateLimiter } from '../../middleware/rateLimit';
import { validate } from '../../middleware/validate';
import { updateOwnProfileSchema, changeOwnPasswordSchema } from './users.validators';
import {
  getMyProfileHandler,
  updateMyProfileHandler,
  changeMyPasswordHandler,
  getUserByIdHandler
} from './users.controller';

export const usersRouter = Router();

usersRouter.use(authenticate);

usersRouter.get('/me', getMyProfileHandler);
usersRouter.patch('/me', validate(updateOwnProfileSchema), updateMyProfileHandler);
usersRouter.post(
  '/me/change-password',
  authRateLimiter,
  validate(changeOwnPasswordSchema),
  changeMyPasswordHandler
);
usersRouter.get('/:userId', getUserByIdHandler);

export default usersRouter;
