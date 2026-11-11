import { z } from 'zod';
import { isValidObjectId } from '../../utils/objectId';

export const quizIdParamSchema = z.object({
  quizId: z
    .string()
    .trim()
    .refine((val) => isValidObjectId(val), {
      message: 'Invalid quizId format. Must be a valid 24-character ObjectId.'
    })
});

export const courseQuizParamSchema = z.object({
  courseId: z
    .string()
    .trim()
    .refine((val) => isValidObjectId(val), {
      message: 'Invalid courseId format. Must be a valid 24-character ObjectId.'
    })
});

const answerMapSchema = z.record(z.string().min(1), z.number().int().min(0));

const answerArrayItemSchema = z.object({
  questionId: z.string().trim().min(1),
  selectedOptionIndex: z.number().int().min(0)
});

export const submitQuizAttemptSchema = z.object({
  answers: z.union([answerMapSchema, z.array(answerArrayItemSchema).min(1)])
});

export type SubmitQuizAttemptInput = z.infer<typeof submitQuizAttemptSchema>;
