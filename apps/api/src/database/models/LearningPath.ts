import { Schema, model, Document, Types } from 'mongoose';

export interface ILearningPath extends Document {
  title: string;
  slug: string;
  description: string;
  courseIds: Types.ObjectId[];
  estimatedHours: number;
  level: string;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

const LearningPathSchema = new Schema<ILearningPath>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, required: true },
    courseIds: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    estimatedHours: { type: Number, default: 40 },
    level: { type: String, default: 'Beginner to Intermediate' },
    status: { type: String, enum: ['draft', 'published'], default: 'published' }
  },
  { timestamps: true }
);

export const LearningPath = model<ILearningPath>('LearningPath', LearningPathSchema);
export default LearningPath;
