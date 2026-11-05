import { Schema, model, Document, Types } from 'mongoose';

export type LessonContentType = 'video' | 'article' | 'resource';
export type VideoProvider = 'youtube' | 'external' | 'none';
export type ContentRightsStatus = 'permitted_embed' | 'licensed' | 'owned' | 'pending_review';
export type LessonStatus = 'draft' | 'published';

export interface IResourceLink {
  title: string;
  url: string;
}

export interface ILesson extends Document {
  courseId: Types.ObjectId;
  moduleId: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  contentType: LessonContentType;
  videoProvider: VideoProvider;
  videoUrl?: string;
  videoEmbedId?: string;
  resourceUrl?: string;
  resourceLinks: IResourceLink[];
  sourceAttribution?: string;
  contentRightsStatus: ContentRightsStatus;
  durationMinutes: number;
  order: number;
  isRequired: boolean;
  isFreePreview: boolean;
  status: LessonStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceLinkSchema = new Schema<IResourceLink>(
  {
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const LessonSchema = new Schema<ILesson>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    moduleId: { type: Schema.Types.ObjectId, ref: 'CourseModule', required: true, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
    contentType: { type: String, enum: ['video', 'article', 'resource'], default: 'video' },
    videoProvider: { type: String, enum: ['youtube', 'external', 'none'], default: 'youtube' },
    videoUrl: { type: String, default: '' },
    videoEmbedId: { type: String, default: '' },
    resourceUrl: { type: String, default: '' },
    resourceLinks: { type: [ResourceLinkSchema], default: [] },
    sourceAttribution: { type: String, default: 'Axivon Curriculum' },
    contentRightsStatus: {
      type: String,
      enum: ['permitted_embed', 'licensed', 'owned', 'pending_review'],
      default: 'permitted_embed'
    },
    durationMinutes: { type: Number, default: 15 },
    order: { type: Number, required: true, default: 1 },
    isRequired: { type: Boolean, default: true },
    isFreePreview: { type: Boolean, default: false },
    status: { type: String, enum: ['draft', 'published'], default: 'published' }
  },
  { timestamps: true }
);

LessonSchema.index({ moduleId: 1, order: 1 });
LessonSchema.index({ courseId: 1, slug: 1 }, { unique: true });

export const Lesson = model<ILesson>('Lesson', LessonSchema);
export default Lesson;
