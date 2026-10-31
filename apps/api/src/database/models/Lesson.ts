import { Schema, model, Document, Types } from 'mongoose';

export interface ILesson extends Document {
  courseId: Types.ObjectId;
  moduleId: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  videoUrl?: string;
  resourceUrl?: string;
  sourceAttribution?: string;
  durationMinutes: number;
  order: number;
  isFreePreview: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    moduleId: { type: Schema.Types.ObjectId, ref: 'CourseModule', required: true, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    resourceUrl: { type: String, default: '' },
    sourceAttribution: { type: String, default: 'Axivon Curriculum' },
    durationMinutes: { type: Number, default: 15 },
    order: { type: Number, required: true, default: 1 },
    isFreePreview: { type: Boolean, default: false }
  },
  { timestamps: true }
);

LessonSchema.index({ moduleId: 1, order: 1 });
LessonSchema.index({ courseId: 1, slug: 1 }, { unique: true });

export const Lesson = model<ILesson>('Lesson', LessonSchema);
export default Lesson;
