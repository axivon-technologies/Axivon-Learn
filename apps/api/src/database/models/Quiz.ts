import { Schema, model, Document, Types } from 'mongoose';

export interface IQuiz extends Document {
  courseId: Types.ObjectId;
  moduleId?: Types.ObjectId;
  lessonId?: Types.ObjectId;
  title: string;
  description?: string;
  passingScore: number;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

const QuizSchema = new Schema<IQuiz>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    moduleId: { type: Schema.Types.ObjectId, ref: 'CourseModule' },
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson' },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    passingScore: { type: Number, default: 2 },
    status: { type: String, enum: ['draft', 'published'], default: 'published' }
  },
  { timestamps: true }
);

export const Quiz = model<IQuiz>('Quiz', QuizSchema);
export default Quiz;
