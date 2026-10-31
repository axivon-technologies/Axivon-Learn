import { Schema, model, Document, Types } from 'mongoose';

export interface ICourseModule extends Document {
  courseId: Types.ObjectId;
  title: string;
  description?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const CourseModuleSchema = new Schema<ICourseModule>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    order: { type: Number, required: true, default: 1 }
  },
  { timestamps: true }
);

CourseModuleSchema.index({ courseId: 1, order: 1 });

export const CourseModule = model<ICourseModule>('CourseModule', CourseModuleSchema);
export default CourseModule;
