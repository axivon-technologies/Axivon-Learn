import { Schema, model, Document, Types } from 'mongoose';

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type PublicationStatus = 'draft' | 'published' | 'archived';

export interface ICourse extends Document {
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  categoryId?: Types.ObjectId;
  level: CourseLevel;
  language: string;
  thumbnailUrl?: string;
  instructorName?: string;
  sourceAttribution?: string;
  status: PublicationStatus;
  outcomes: string[];
  prerequisites: string[];
  estimatedDurationHours: number;
  createdBy?: Types.ObjectId;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    summary: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, required: true, index: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    language: { type: String, default: 'English' },
    thumbnailUrl: { type: String, default: '' },
    instructorName: { type: String, default: 'Axivon Technologies' },
    sourceAttribution: { type: String, default: 'Axivon Curriculum' },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft', index: true },
    outcomes: [{ type: String }],
    prerequisites: [{ type: String }],
    estimatedDurationHours: { type: Number, default: 4 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    publishedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export const Course = model<ICourse>('Course', CourseSchema);
export default Course;
