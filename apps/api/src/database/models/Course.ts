import { Schema, model, Document } from 'mongoose';

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type PublicationStatus = 'draft' | 'published' | 'archived';

export interface ICourse extends Document {
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  level: CourseLevel;
  thumbnailUrl?: string;
  status: PublicationStatus;
  outcomes: string[];
  prerequisites: string[];
  estimatedDurationHours: number;
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
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    thumbnailUrl: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft', index: true },
    outcomes: [{ type: String }],
    prerequisites: [{ type: String }],
    estimatedDurationHours: { type: Number, default: 4 }
  },
  { timestamps: true }
);

export const Course = model<ICourse>('Course', CourseSchema);
export default Course;
