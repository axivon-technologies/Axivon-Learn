import { Schema, model, Document, Types } from 'mongoose';

export interface IEnrollment extends Document {
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  enrolledAt: Date;
  completedLessons: Types.ObjectId[];
  progressPercent: number;
  lastAccessedLessonId?: Types.ObjectId;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    enrolledAt: { type: Date, default: Date.now },
    completedLessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    progressPercent: { type: Number, default: 0, min: 0, max: 100 },
    lastAccessedLessonId: { type: Schema.Types.ObjectId, ref: 'Lesson' },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const Enrollment = model<IEnrollment>('Enrollment', EnrollmentSchema);
export default Enrollment;
