import { Schema, model, Document } from 'mongoose';

export interface IProjectBrief extends Document {
  title: string;
  slug: string;
  description: string;
  category: string;
  level: string;
  skills: string[];
  deliverables: string[];
  durationHours: number;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

const ProjectBriefSchema = new Schema<IProjectBrief>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    level: { type: String, default: 'Intermediate' },
    skills: [{ type: String }],
    deliverables: [{ type: String }],
    durationHours: { type: Number, default: 10 },
    status: { type: String, enum: ['draft', 'published'], default: 'published' }
  },
  { timestamps: true }
);

export const ProjectBrief = model<IProjectBrief>('ProjectBrief', ProjectBriefSchema);
export default ProjectBrief;
