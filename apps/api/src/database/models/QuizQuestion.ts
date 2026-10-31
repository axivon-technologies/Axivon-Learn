import { Schema, model, Document, Types } from 'mongoose';

export interface IQuizQuestion extends Document {
  quizId: Types.ObjectId;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
  order: number;
}

const QuizQuestionSchema = new Schema<IQuizQuestion>(
  {
    quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
    prompt: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctOptionIndex: { type: Number, required: true, select: false },
    explanation: { type: String, default: '' },
    order: { type: Number, default: 1 }
  },
  { timestamps: true }
);

export const QuizQuestion = model<IQuizQuestion>('QuizQuestion', QuizQuestionSchema);
export default QuizQuestion;
