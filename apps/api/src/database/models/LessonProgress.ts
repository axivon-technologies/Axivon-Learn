import { Schema, model, Document, Types } from 'mongoose';

export type LessonProgressStatus = 'not_started' | 'in_progress' | 'completed';

export interface ILessonProgress extends Document {
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  lessonId: Types.ObjectId;
  status: LessonProgressStatus;
  completedAt?: Date | null;
  lastViewedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LessonProgressSchema = new Schema<ILessonProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true, index: true },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'in_progress'
    },
    completedAt: { type: Date, default: null },
    lastViewedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Authoritative idempotent compound index per Backend Implementation Specification Section 6
LessonProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

export const LessonProgress = model<ILessonProgress>('LessonProgress', LessonProgressSchema);
export default LessonProgress;
