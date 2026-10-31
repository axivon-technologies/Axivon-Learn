import { Schema, model, Document, Types } from 'mongoose';

export interface IQuizAttempt extends Document {
  userId: Types.ObjectId;
  quizId: Types.ObjectId;
  answers: { [questionId: string]: number };
  score: number;
  totalQuestions: number;
  passed: boolean;
  attemptedAt: Date;
}

const QuizAttemptSchema = new Schema<IQuizAttempt>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
    answers: { type: Map, of: Number },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    attemptedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const QuizAttempt = model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);
export default QuizAttempt;
