import { z } from 'zod';
import { isValidObjectId } from '../../utils/objectId';

export const courseIdParamSchema = z.object({
  courseId: z
    .string()
    .trim()
    .refine((val) => isValidObjectId(val), {
      message: 'Invalid courseId format. Must be a valid 24-character ObjectId.'
    })
});
