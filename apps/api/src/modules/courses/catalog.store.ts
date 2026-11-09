import { isDatabaseConnected } from '../../database/connection';
import { Category } from '../../database/models/Category';
import { Course, CourseLevel, PublicationStatus } from '../../database/models/Course';
import { CourseModule } from '../../database/models/CourseModule';
import { Lesson, LessonContentType, VideoProvider, ContentRightsStatus, LessonStatus, IResourceLink } from '../../database/models/Lesson';
import { LearningPath } from '../../database/models/LearningPath';
import { ProjectBrief } from '../../database/models/ProjectBrief';
import { escapeRegex } from '../../utils/regex';
import { isValidObjectId } from '../../utils/objectId';

export interface StoredCategoryRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoredCourseRecord {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  categoryId?: string;
  level: CourseLevel;
  language: string;
  thumbnailUrl: string;
  instructorName: string;
  sourceAttribution: string;
  status: PublicationStatus;
  outcomes: string[];
  prerequisites: string[];
  estimatedDurationHours: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoredModuleRecord {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoredLessonRecord {
  id: string;
  courseId: string;
  moduleId: string;
  title: string;
  slug: string;
  description: string;
  contentType: LessonContentType;
  videoProvider: VideoProvider;
  videoUrl: string;
  videoEmbedId: string;
  resourceUrl: string;
  resourceLinks: IResourceLink[];
  sourceAttribution: string;
  contentRightsStatus: ContentRightsStatus;
  durationMinutes: number;
  order: number;
  isRequired: boolean;
  isFreePreview: boolean;
  status: LessonStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoredLearningPathRecord {
  id: string;
  title: string;
  slug: string;
  description: string;
  courseIds: string[];
  estimatedHours: number;
  level: string;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

export interface StoredProjectBriefRecord {
  id: string;
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

// -----------------------------------------------------------------------------
// Fallback In-Memory Catalog Store (Used ONLY when MongoDB is disconnected in CI/tests)
// Includes active/inactive categories and published/draft/archived entities to verify
// strict non-leakage rules deterministically.
// -----------------------------------------------------------------------------
export const MEMORY_CATALOG_IDS = {
  catAI: '607f1f77bcf86cd799439001',
  catWeb: '607f1f77bcf86cd799439002',
  catCloud: '607f1f77bcf86cd799439003',
  catInactive: '607f1f77bcf86cd799439004',
  courseAI: '607f1f77bcf86cd799439011',
  courseWeb: '607f1f77bcf86cd799439012',
  courseDraft: '607f1f77bcf86cd799439013',
  courseArchived: '607f1f77bcf86cd799439014',
  modAI1: '607f1f77bcf86cd799439021',
  modAI2: '607f1f77bcf86cd799439022',
  modWeb1: '607f1f77bcf86cd799439023',
  lessonAI1: '607f1f77bcf86cd799439031',
  lessonAI2: '607f1f77bcf86cd799439032',
  lessonAIDraft: '607f1f77bcf86cd799439033',
  lessonWeb1: '607f1f77bcf86cd799439034',
  lessonWeb2: '607f1f77bcf86cd799439035',
  pathAI: '607f1f77bcf86cd799439041',
  pathWeb: '607f1f77bcf86cd799439042',
  pathDraft: '607f1f77bcf86cd799439043',
  projApi: '607f1f77bcf86cd799439051',
  projMl: '607f1f77bcf86cd799439052',
  projDraft: '607f1f77bcf86cd799439053'
} as const;

let memoryCategories: StoredCategoryRecord[] = [];
let memoryCourses: StoredCourseRecord[] = [];
let memoryModules: StoredModuleRecord[] = [];
let memoryLessons: StoredLessonRecord[] = [];
let memoryPaths: StoredLearningPathRecord[] = [];
let memoryProjects: StoredProjectBriefRecord[] = [];

function ensureDefaultMemoryCatalog(): void {
  if (memoryCategories.length > 0) return;

  const t1 = new Date('2026-10-15T10:00:00.000Z');
  const t2 = new Date('2026-10-20T10:00:00.000Z');
  const t3 = new Date('2026-10-25T10:00:00.000Z');

  memoryCategories = [
    {
      id: MEMORY_CATALOG_IDS.catAI,
      name: 'AI & Machine Learning',
      slug: 'ai-ml',
      description: 'Foundations and practical applications in data science, ML, and neural networks.',
      icon: 'cpu',
      sortOrder: 1,
      isActive: true,
      createdAt: t1,
      updatedAt: t1
    },
    {
      id: MEMORY_CATALOG_IDS.catWeb,
      name: 'Web Development',
      slug: 'web-development',
      description: 'Modern full-stack web applications, TypeScript, React, and REST APIs.',
      icon: 'code',
      sortOrder: 2,
      isActive: true,
      createdAt: t1,
      updatedAt: t1
    },
    {
      id: MEMORY_CATALOG_IDS.catCloud,
      name: 'Cloud & DevOps',
      slug: 'cloud-devops',
      description: 'Continuous integration, containerization, and cloud deployment pipelines.',
      icon: 'cloud',
      sortOrder: 3,
      isActive: true,
      createdAt: t1,
      updatedAt: t1
    },
    {
      id: MEMORY_CATALOG_IDS.catInactive,
      name: 'Legacy Mainframes',
      slug: 'legacy-mainframes',
      description: 'Retired category hidden from public learners.',
      icon: 'archive',
      sortOrder: 99,
      isActive: false,
      createdAt: t1,
      updatedAt: t1
    }
  ];

  memoryCourses = [
    {
      id: MEMORY_CATALOG_IDS.courseAI,
      title: 'AI & Machine Learning Foundations',
      slug: 'ai-ml-foundations',
      summary: 'Master foundational Python, NumPy, Pandas, regression models, and neural network basics.',
      description: 'A complete practical overview of modern AI. Learn core linear algebra, statistical learning, and model evaluation techniques.',
      category: 'AI & Machine Learning',
      categoryId: MEMORY_CATALOG_IDS.catAI,
      level: 'beginner',
      language: 'English',
      thumbnailUrl: '',
      instructorName: 'Axivon Technologies',
      sourceAttribution: 'Axivon Curriculum',
      status: 'published',
      outcomes: [
        'Understand Python data structures for ML',
        'Train regression and classification algorithms',
        'Evaluate models using precision, recall, and loss curves'
      ],
      prerequisites: ['Basic programming knowledge'],
      estimatedDurationHours: 6,
      publishedAt: t2,
      createdAt: t2,
      updatedAt: t2
    },
    {
      id: MEMORY_CATALOG_IDS.courseWeb,
      title: 'Full Stack Web Development',
      slug: 'full-stack-web-development',
      summary: 'Build end-to-end web applications with React, TypeScript, Node.js, Express, and MongoDB.',
      description: 'Learn modern web architecture from HTTP protocols to responsive layouts and scalable REST APIs.',
      category: 'Web Development',
      categoryId: MEMORY_CATALOG_IDS.catWeb,
      level: 'intermediate',
      language: 'English',
      thumbnailUrl: '',
      instructorName: 'Axivon Technologies',
      sourceAttribution: 'Axivon Curriculum',
      status: 'published',
      outcomes: [
        'Design responsive component systems in React',
        'Build modular RESTful API endpoints in Express',
        'Model document databases with Mongoose schemas'
      ],
      prerequisites: ['Basic HTML and JavaScript familiarity'],
      estimatedDurationHours: 8,
      publishedAt: t3,
      createdAt: t3,
      updatedAt: t3
    },
    {
      id: MEMORY_CATALOG_IDS.courseDraft,
      title: 'Internal Draft Kubernetes Deep Dive',
      slug: 'unpublished-kubernetes-draft',
      summary: 'Work-in-progress curriculum that must never be returned by public catalog APIs.',
      description: 'Internal authoring draft.',
      category: 'Cloud & DevOps',
      categoryId: MEMORY_CATALOG_IDS.catCloud,
      level: 'advanced',
      language: 'English',
      thumbnailUrl: '',
      instructorName: 'Axivon Technologies',
      sourceAttribution: 'Axivon Curriculum',
      status: 'draft',
      outcomes: ['Cluster networking'],
      prerequisites: ['Linux basics'],
      estimatedDurationHours: 12,
      publishedAt: null,
      createdAt: t3,
      updatedAt: t3
    },
    {
      id: MEMORY_CATALOG_IDS.courseArchived,
      title: 'Archived AngularJS 1.x Course',
      slug: 'archived-angularjs-course',
      summary: 'Retired course that must never appear in public catalog.',
      description: 'Archived content.',
      category: 'Web Development',
      categoryId: MEMORY_CATALOG_IDS.catWeb,
      level: 'beginner',
      language: 'English',
      thumbnailUrl: '',
      instructorName: 'Axivon Technologies',
      sourceAttribution: 'Axivon Curriculum',
      status: 'archived',
      outcomes: [],
      prerequisites: [],
      estimatedDurationHours: 5,
      publishedAt: null,
      createdAt: t1,
      updatedAt: t1
    }
  ];

  memoryModules = [
    {
      id: MEMORY_CATALOG_IDS.modAI1,
      courseId: MEMORY_CATALOG_IDS.courseAI,
      title: 'Introduction to Machine Learning',
      description: 'Core concepts and environment setup',
      order: 1,
      createdAt: t2,
      updatedAt: t2
    },
    {
      id: MEMORY_CATALOG_IDS.modAI2,
      courseId: MEMORY_CATALOG_IDS.courseAI,
      title: 'Supervised Learning Models',
      description: 'Linear regression, classification, and metrics',
      order: 2,
      createdAt: t2,
      updatedAt: t2
    },
    {
      id: MEMORY_CATALOG_IDS.modWeb1,
      courseId: MEMORY_CATALOG_IDS.courseWeb,
      title: 'Web Architecture & RESTful APIs',
      description: 'Client-server communications and HTTP protocols',
      order: 1,
      createdAt: t3,
      updatedAt: t3
    }
  ];

  memoryLessons = [
    {
      id: MEMORY_CATALOG_IDS.lessonAI1,
      courseId: MEMORY_CATALOG_IDS.courseAI,
      moduleId: MEMORY_CATALOG_IDS.modAI1,
      title: 'What is Machine Learning?',
      slug: 'what-is-machine-learning',
      description: 'Supervised vs. unsupervised learning paradigms and mathematical concepts.',
      contentType: 'video',
      videoProvider: 'youtube',
      videoUrl: 'https://www.youtube.com/watch?v=ukzFI9rgwfU',
      videoEmbedId: 'ukzFI9rgwfU',
      resourceUrl: '',
      resourceLinks: [{ title: 'Scikit-Learn User Guide', url: 'https://scikit-learn.org/stable/user_guide.html' }],
      sourceAttribution: 'Axivon Curriculum (Permitted YouTube Embed)',
      contentRightsStatus: 'permitted_embed',
      durationMinutes: 20,
      order: 1,
      isRequired: true,
      isFreePreview: true,
      status: 'published',
      createdAt: t2,
      updatedAt: t2
    },
    {
      id: MEMORY_CATALOG_IDS.lessonAI2,
      courseId: MEMORY_CATALOG_IDS.courseAI,
      moduleId: MEMORY_CATALOG_IDS.modAI2,
      title: 'Training Your First Regression Model',
      slug: 'training-first-regression-model',
      description: 'Hands-on feature scaling, train/test splitting, and mean squared error.',
      contentType: 'article',
      videoProvider: 'none',
      videoUrl: '',
      videoEmbedId: '',
      resourceUrl: 'https://numpy.org/doc/stable/',
      resourceLinks: [{ title: 'NumPy Documentation', url: 'https://numpy.org/doc/stable/' }],
      sourceAttribution: 'Axivon Curriculum',
      contentRightsStatus: 'owned',
      durationMinutes: 30,
      order: 1,
      isRequired: true,
      isFreePreview: false,
      status: 'published',
      createdAt: t2,
      updatedAt: t2
    },
    {
      id: MEMORY_CATALOG_IDS.lessonAIDraft,
      courseId: MEMORY_CATALOG_IDS.courseAI,
      moduleId: MEMORY_CATALOG_IDS.modAI2,
      title: 'Unpublished Draft Lesson on Transformers',
      slug: 'unpublished-draft-transformers',
      description: 'Draft lesson still under review.',
      contentType: 'video',
      videoProvider: 'none',
      videoUrl: '',
      videoEmbedId: '',
      resourceUrl: '',
      resourceLinks: [],
      sourceAttribution: 'Axivon Curriculum',
      contentRightsStatus: 'pending_review',
      durationMinutes: 25,
      order: 2,
      isRequired: false,
      isFreePreview: false,
      status: 'draft',
      createdAt: t2,
      updatedAt: t2
    },
    {
      id: MEMORY_CATALOG_IDS.lessonWeb1,
      courseId: MEMORY_CATALOG_IDS.courseWeb,
      moduleId: MEMORY_CATALOG_IDS.modWeb1,
      title: 'REST Protocol & Modular Architecture',
      slug: 'rest-protocol-architecture',
      description: 'Standard HTTP methods, headers, status codes, and monorepo structure.',
      contentType: 'video',
      videoProvider: 'youtube',
      videoUrl: 'https://www.youtube.com/watch?v=-MTSQjw5DrM',
      videoEmbedId: '-MTSQjw5DrM',
      resourceUrl: '',
      resourceLinks: [{ title: 'MDN HTTP Overview', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview' }],
      sourceAttribution: 'Axivon Curriculum (Permitted YouTube Embed)',
      contentRightsStatus: 'permitted_embed',
      durationMinutes: 25,
      order: 1,
      isRequired: true,
      isFreePreview: true,
      status: 'published',
      createdAt: t3,
      updatedAt: t3
    },
    {
      id: MEMORY_CATALOG_IDS.lessonWeb2,
      courseId: MEMORY_CATALOG_IDS.courseWeb,
      moduleId: MEMORY_CATALOG_IDS.modWeb1,
      title: 'Authentication, JWTs & Ownership Guards',
      slug: 'authentication-jwts-ownership-guards',
      description: 'Designing secure session flows, RBAC middleware, and horizontal ownership checks.',
      contentType: 'article',
      videoProvider: 'none',
      videoUrl: '',
      videoEmbedId: '',
      resourceUrl: 'https://expressjs.com/en/advanced/best-practice-security.html',
      resourceLinks: [{ title: 'Express Security Best Practices', url: 'https://expressjs.com/en/advanced/best-practice-security.html' }],
      sourceAttribution: 'Axivon Curriculum',
      contentRightsStatus: 'owned',
      durationMinutes: 35,
      order: 2,
      isRequired: true,
      isFreePreview: false,
      status: 'published',
      createdAt: t3,
      updatedAt: t3
    }
  ];

  memoryPaths = [
    {
      id: MEMORY_CATALOG_IDS.pathAI,
      title: 'AI & Machine Learning Foundations',
      slug: 'ai-ml-path',
      description: 'Step-by-step track from Python foundations to working neural network models.',
      courseIds: [MEMORY_CATALOG_IDS.courseAI, MEMORY_CATALOG_IDS.courseDraft],
      estimatedHours: 40,
      level: 'Beginner to Intermediate',
      status: 'published',
      createdAt: t2,
      updatedAt: t2
    },
    {
      id: MEMORY_CATALOG_IDS.pathWeb,
      title: 'Full Stack Web Development',
      slug: 'full-stack-path',
      description: 'Complete roadmap covering client components, servers, authentication, and databases.',
      courseIds: [MEMORY_CATALOG_IDS.courseWeb],
      estimatedHours: 50,
      level: 'Beginner to Advanced',
      status: 'published',
      createdAt: t3,
      updatedAt: t3
    },
    {
      id: MEMORY_CATALOG_IDS.pathDraft,
      title: 'Internal Draft Cloud Security Track',
      slug: 'draft-cloud-security-path',
      description: 'Unpublished learning path.',
      courseIds: [MEMORY_CATALOG_IDS.courseDraft],
      estimatedHours: 30,
      level: 'Advanced',
      status: 'draft',
      createdAt: t3,
      updatedAt: t3
    }
  ];

  memoryProjects = [
    {
      id: MEMORY_CATALOG_IDS.projApi,
      title: 'Modular EdTech REST API Service',
      slug: 'modular-edtech-rest-api',
      description: 'Design and build a secure Express + TypeScript + MongoDB API with RBAC, Zod validation, and automated Supertest suites.',
      category: 'Web Development',
      level: 'Intermediate',
      skills: ['TypeScript', 'Node.js', 'Express', 'MongoDB', 'Supertest'],
      deliverables: ['Modular API endpoints', 'Authentication & RBAC middleware', 'Integration test suite'],
      durationHours: 12,
      status: 'published',
      createdAt: t3,
      updatedAt: t3
    },
    {
      id: MEMORY_CATALOG_IDS.projMl,
      title: 'Customer Churn Prediction Pipeline',
      slug: 'customer-churn-prediction-pipeline',
      description: 'Preprocess tabular customer datasets, train classification models, and evaluate precision-recall trade-offs.',
      category: 'AI & Machine Learning',
      level: 'Beginner',
      skills: ['Python', 'Pandas', 'Scikit-Learn', 'Model Evaluation'],
      deliverables: ['Cleaned feature notebook', 'Trained baseline & ensemble classifiers', 'Evaluation summary report'],
      durationHours: 8,
      status: 'published',
      createdAt: t2,
      updatedAt: t2
    },
    {
      id: MEMORY_CATALOG_IDS.projDraft,
      title: 'Draft Distributed Tracing Project',
      slug: 'draft-distributed-tracing-project',
      description: 'Unpublished internal project brief.',
      category: 'Cloud & DevOps',
      level: 'Advanced',
      skills: ['OpenTelemetry'],
      deliverables: ['Collector config'],
      durationHours: 16,
      status: 'draft',
      createdAt: t3,
      updatedAt: t3
    }
  ];
}

export function resetMemoryCatalog(): void {
  memoryCategories = [];
  memoryCourses = [];
  memoryModules = [];
  memoryLessons = [];
  memoryPaths = [];
  memoryProjects = [];
  ensureDefaultMemoryCatalog();
}

// -----------------------------------------------------------------------------
// Category Queries
// -----------------------------------------------------------------------------
export async function findActiveCategoriesWithCounts(): Promise<
  Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    sortOrder: number;
    courseCount: number;
  }>
> {
  if (isDatabaseConnected()) {
    const categories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    return Promise.all(
      categories.map(async (cat) => {
        const nameRegex = new RegExp(`^${escapeRegex(cat.name)}$`, 'i');
        const courseCount = await Course.countDocuments({
          status: 'published',
          $or: [{ categoryId: cat._id }, { category: nameRegex }]
        });
        return {
          id: cat._id.toString(),
          name: cat.name,
          slug: cat.slug,
          description: cat.description || '',
          icon: cat.icon || 'code',
          sortOrder: cat.sortOrder ?? 0,
          courseCount
        };
      })
    );
  }

  ensureDefaultMemoryCatalog();
  return memoryCategories
    .filter((c) => c.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
    .map((cat) => {
      const courseCount = memoryCourses.filter(
        (course) =>
          course.status === 'published' &&
          (course.categoryId === cat.id || course.category.toLowerCase() === cat.name.toLowerCase())
      ).length;
      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        sortOrder: cat.sortOrder,
        courseCount
      };
    });
}

export async function findActiveCategoryBySlug(slug: string) {
  const normalizedSlug = slug.trim().toLowerCase();
  if (isDatabaseConnected()) {
    const cat = await Category.findOne({ slug: normalizedSlug, isActive: true }).lean();
    if (!cat) return null;
    const nameRegex = new RegExp(`^${escapeRegex(cat.name)}$`, 'i');
    const courseCount = await Course.countDocuments({
      status: 'published',
      $or: [{ categoryId: cat._id }, { category: nameRegex }]
    });
    return {
      id: cat._id.toString(),
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      icon: cat.icon || 'code',
      sortOrder: cat.sortOrder ?? 0,
      courseCount
    };
  }

  ensureDefaultMemoryCatalog();
  const cat = memoryCategories.find((c) => c.isActive && c.slug === normalizedSlug);
  if (!cat) return null;
  const courseCount = memoryCourses.filter(
    (course) =>
      course.status === 'published' &&
      (course.categoryId === cat.id || course.category.toLowerCase() === cat.name.toLowerCase())
  ).length;
  return {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    icon: cat.icon,
    sortOrder: cat.sortOrder,
    courseCount
  };
}

// -----------------------------------------------------------------------------
// Course Catalog Queries (Public — Strictly Published Only)
// -----------------------------------------------------------------------------
export interface ListPublishedCoursesParams {
  category?: string;
  level?: CourseLevel;
  search?: string;
  sort: 'newest' | 'title' | 'duration';
  page: number;
  limit: number;
}

export async function queryPublishedCourses(params: ListPublishedCoursesParams) {
  const rawCat = params.category?.trim() || '';
  const rawSearch = params.search?.trim() || '';
  const skip = (params.page - 1) * params.limit;

  if (isDatabaseConnected()) {
    const andConditions: Record<string, unknown>[] = [{ status: 'published' }];

    if (rawCat && rawCat.toLowerCase() !== 'all') {
      // Allow matching either Category slug or Category display name safely
      const matchedCat = await Category.findOne({
        isActive: true,
        $or: [
          { slug: rawCat.toLowerCase() },
          { name: new RegExp(`^${escapeRegex(rawCat)}$`, 'i') }
        ]
      }).lean();

      if (matchedCat) {
        andConditions.push({
          $or: [
            { categoryId: matchedCat._id },
            { category: new RegExp(`^${escapeRegex(matchedCat.name)}$`, 'i') }
          ]
        });
      } else {
        andConditions.push({
          category: new RegExp(`^${escapeRegex(rawCat)}$`, 'i')
        });
      }
    }

    if (params.level) {
      andConditions.push({ level: params.level });
    }

    if (rawSearch) {
      const searchRegex = new RegExp(escapeRegex(rawSearch), 'i');
      andConditions.push({
        $or: [{ title: searchRegex }, { summary: searchRegex }, { description: searchRegex }]
      });
    }

    const filter = andConditions.length === 1 ? andConditions[0] : { $and: andConditions };

    const sortSpec: Record<string, 1 | -1> =
      params.sort === 'title'
        ? { title: 1 }
        : params.sort === 'duration'
          ? { estimatedDurationHours: 1, title: 1 }
          : { createdAt: -1 };

    const [total, docs] = await Promise.all([
      Course.countDocuments(filter),
      Course.find(filter).sort(sortSpec).skip(skip).limit(params.limit).lean()
    ]);

    const items = await Promise.all(
      docs.map(async (c) => {
        const [moduleCount, lessonCount] = await Promise.all([
          CourseModule.countDocuments({ courseId: c._id }),
          Lesson.countDocuments({
            courseId: c._id,
            $or: [{ status: 'published' }, { status: { $exists: false } }]
          })
        ]);
        return {
          id: c._id.toString(),
          title: c.title,
          slug: c.slug,
          summary: c.summary,
          description: c.description || '',
          category: c.category,
          level: c.level,
          language: c.language || 'English',
          thumbnailUrl: c.thumbnailUrl || '',
          instructorName: c.instructorName || 'Axivon Technologies',
          sourceAttribution: c.sourceAttribution || 'Axivon Curriculum',
          status: 'published' as const,
          outcomes: c.outcomes || [],
          prerequisites: c.prerequisites || [],
          estimatedDurationHours: c.estimatedDurationHours ?? 4,
          moduleCount,
          lessonCount,
          publishedAt: c.publishedAt ? new Date(c.publishedAt).toISOString() : null
        };
      })
    );

    return {
      items,
      total
    };
  }

  ensureDefaultMemoryCatalog();
  let filtered = memoryCourses.filter((c) => c.status === 'published');

  if (rawCat && rawCat.toLowerCase() !== 'all') {
    const lowerCat = rawCat.toLowerCase();
    const matchedCat = memoryCategories.find(
      (cat) => cat.isActive && (cat.slug === lowerCat || cat.name.toLowerCase() === lowerCat)
    );
    filtered = filtered.filter((c) => {
      if (matchedCat) {
        return c.categoryId === matchedCat.id || c.category.toLowerCase() === matchedCat.name.toLowerCase();
      }
      return c.category.toLowerCase() === lowerCat;
    });
  }

  if (params.level) {
    filtered = filtered.filter((c) => c.level === params.level);
  }

  if (rawSearch) {
    const q = rawSearch.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }

  filtered.sort((a, b) => {
    if (params.sort === 'title') return a.title.localeCompare(b.title);
    if (params.sort === 'duration') {
      return a.estimatedDurationHours - b.estimatedDurationHours || a.title.localeCompare(b.title);
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  const total = filtered.length;
  const paged = filtered.slice(skip, skip + params.limit);

  const items = paged.map((c) => {
    const moduleCount = memoryModules.filter((m) => m.courseId === c.id).length;
    const lessonCount = memoryLessons.filter(
      (l) => l.courseId === c.id && l.status === 'published'
    ).length;
    return {
      id: c.id,
      title: c.title,
      slug: c.slug,
      summary: c.summary,
      description: c.description,
      category: c.category,
      level: c.level,
      language: c.language,
      thumbnailUrl: c.thumbnailUrl,
      instructorName: c.instructorName,
      sourceAttribution: c.sourceAttribution,
      status: 'published' as const,
      outcomes: [...c.outcomes],
      prerequisites: [...c.prerequisites],
      estimatedDurationHours: c.estimatedDurationHours,
      moduleCount,
      lessonCount,
      publishedAt: c.publishedAt ? c.publishedAt.toISOString() : null
    };
  });

  return { items, total };
}

export async function findPublishedCourseDetailBySlug(slug: string) {
  const normalizedSlug = slug.trim().toLowerCase();

  if (isDatabaseConnected()) {
    const course = await Course.findOne({ slug: normalizedSlug, status: 'published' }).lean();
    if (!course) return null;

    const modules = await CourseModule.find({ courseId: course._id }).sort({ order: 1 }).lean();
    const populatedModules = await Promise.all(
      modules.map(async (mod) => {
        const lessons = await Lesson.find({
          moduleId: mod._id,
          $or: [{ status: 'published' }, { status: { $exists: false } }]
        })
          .sort({ order: 1 })
          .lean();

        return {
          id: mod._id.toString(),
          title: mod.title,
          description: mod.description || '',
          order: mod.order,
          lessons: lessons.map((l) => ({
            id: l._id.toString(),
            title: l.title,
            slug: l.slug,
            description: l.description || '',
            contentType: l.contentType || 'video',
            durationMinutes: l.durationMinutes ?? 15,
            order: l.order,
            isRequired: l.isRequired ?? true,
            isFreePreview: Boolean(l.isFreePreview),
            sourceAttribution: l.sourceAttribution || 'Axivon Curriculum'
          }))
        };
      })
    );

    const lessonCount = populatedModules.reduce((acc, m) => acc + m.lessons.length, 0);

    return {
      id: course._id.toString(),
      title: course.title,
      slug: course.slug,
      summary: course.summary,
      description: course.description || '',
      category: course.category,
      level: course.level,
      language: course.language || 'English',
      thumbnailUrl: course.thumbnailUrl || '',
      instructorName: course.instructorName || 'Axivon Technologies',
      sourceAttribution: course.sourceAttribution || 'Axivon Curriculum',
      status: 'published' as const,
      outcomes: course.outcomes || [],
      prerequisites: course.prerequisites || [],
      estimatedDurationHours: course.estimatedDurationHours ?? 4,
      moduleCount: populatedModules.length,
      lessonCount,
      publishedAt: course.publishedAt ? new Date(course.publishedAt).toISOString() : null,
      modules: populatedModules
    };
  }

  ensureDefaultMemoryCatalog();
  const course = memoryCourses.find((c) => c.slug === normalizedSlug && c.status === 'published');
  if (!course) return null;

  const modules = memoryModules
    .filter((m) => m.courseId === course.id)
    .sort((a, b) => a.order - b.order)
    .map((mod) => {
      const lessons = memoryLessons
        .filter((l) => l.moduleId === mod.id && l.status === 'published')
        .sort((a, b) => a.order - b.order)
        .map((l) => ({
          id: l.id,
          title: l.title,
          slug: l.slug,
          description: l.description,
          contentType: l.contentType,
          durationMinutes: l.durationMinutes,
          order: l.order,
          isRequired: l.isRequired,
          isFreePreview: l.isFreePreview,
          sourceAttribution: l.sourceAttribution
        }));

      return {
        id: mod.id,
        title: mod.title,
        description: mod.description,
        order: mod.order,
        lessons
      };
    });

  const lessonCount = modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    summary: course.summary,
    description: course.description,
    category: course.category,
    level: course.level,
    language: course.language,
    thumbnailUrl: course.thumbnailUrl,
    instructorName: course.instructorName,
    sourceAttribution: course.sourceAttribution,
    status: 'published' as const,
    outcomes: [...course.outcomes],
    prerequisites: [...course.prerequisites],
    estimatedDurationHours: course.estimatedDurationHours,
    moduleCount: modules.length,
    lessonCount,
    publishedAt: course.publishedAt ? course.publishedAt.toISOString() : null,
    modules
  };
}

// -----------------------------------------------------------------------------
// Learning Paths Queries (Public — Strictly Published Paths & Published Courses Only)
// -----------------------------------------------------------------------------
async function resolveOrderedPublishedCoursesForIds(courseIds: string[]) {
  if (courseIds.length === 0) return [];

  if (isDatabaseConnected()) {
    const docs = await Course.find({
      _id: { $in: courseIds },
      status: 'published'
    }).lean();

    const byId = new Map(docs.map((d) => [d._id.toString(), d]));
    return courseIds
      .map((id) => byId.get(id))
      .filter((d): d is NonNullable<typeof d> => Boolean(d))
      .map((c) => ({
        id: c._id.toString(),
        title: c.title,
        slug: c.slug,
        summary: c.summary,
        category: c.category,
        level: c.level,
        estimatedDurationHours: c.estimatedDurationHours ?? 4
      }));
  }

  ensureDefaultMemoryCatalog();
  const byId = new Map(
    memoryCourses.filter((c) => c.status === 'published').map((c) => [c.id, c])
  );
  return courseIds
    .map((id) => byId.get(id))
    .filter((c): c is StoredCourseRecord => Boolean(c))
    .map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      summary: c.summary,
      category: c.category,
      level: c.level,
      estimatedDurationHours: c.estimatedDurationHours
    }));
}

export async function findPublishedLearningPaths() {
  if (isDatabaseConnected()) {
    const paths = await LearningPath.find({ status: 'published' }).sort({ createdAt: 1 }).lean();
    return Promise.all(
      paths.map(async (p) => {
        const ids = (p.courseIds || []).map((id) => id.toString());
        const courses = await resolveOrderedPublishedCoursesForIds(ids);
        return {
          id: p._id.toString(),
          title: p.title,
          slug: p.slug,
          description: p.description,
          level: p.level,
          estimatedHours: p.estimatedHours,
          courseCount: courses.length,
          courses
        };
      })
    );
  }

  ensureDefaultMemoryCatalog();
  const publishedPaths = memoryPaths.filter((p) => p.status === 'published');
  return Promise.all(
    publishedPaths.map(async (p) => {
      const courses = await resolveOrderedPublishedCoursesForIds(p.courseIds);
      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.description,
        level: p.level,
        estimatedHours: p.estimatedHours,
        courseCount: courses.length,
        courses
      };
    })
  );
}

export async function findPublishedLearningPathBySlug(slug: string) {
  const normalizedSlug = slug.trim().toLowerCase();

  if (isDatabaseConnected()) {
    const p = await LearningPath.findOne({ slug: normalizedSlug, status: 'published' }).lean();
    if (!p) return null;
    const ids = (p.courseIds || []).map((id) => id.toString());
    const courses = await resolveOrderedPublishedCoursesForIds(ids);
    return {
      id: p._id.toString(),
      title: p.title,
      slug: p.slug,
      description: p.description,
      level: p.level,
      estimatedHours: p.estimatedHours,
      courseCount: courses.length,
      courses
    };
  }

  ensureDefaultMemoryCatalog();
  const p = memoryPaths.find((item) => item.slug === normalizedSlug && item.status === 'published');
  if (!p) return null;
  const courses = await resolveOrderedPublishedCoursesForIds(p.courseIds);
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    level: p.level,
    estimatedHours: p.estimatedHours,
    courseCount: courses.length,
    courses
  };
}

// -----------------------------------------------------------------------------
// Project Briefs Queries (Public — Strictly Published Only)
// -----------------------------------------------------------------------------
export interface ListPublishedProjectsParams {
  category?: string;
  level?: string;
  search?: string;
  page: number;
  limit: number;
}

export async function queryPublishedProjects(params: ListPublishedProjectsParams) {
  const rawCat = params.category?.trim() || '';
  const rawLevel = params.level?.trim() || '';
  const rawSearch = params.search?.trim() || '';
  const skip = (params.page - 1) * params.limit;

  if (isDatabaseConnected()) {
    const filter: Record<string, unknown> = { status: 'published' };
    if (rawCat && rawCat.toLowerCase() !== 'all') {
      filter.category = new RegExp(`^${escapeRegex(rawCat)}$`, 'i');
    }
    if (rawLevel) {
      filter.level = new RegExp(`^${escapeRegex(rawLevel)}$`, 'i');
    }
    if (rawSearch) {
      const searchRegex = new RegExp(escapeRegex(rawSearch), 'i');
      filter.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    const [total, docs] = await Promise.all([
      ProjectBrief.countDocuments(filter),
      ProjectBrief.find(filter).sort({ createdAt: -1 }).skip(skip).limit(params.limit).lean()
    ]);

    return {
      items: docs.map((p) => ({
        id: p._id.toString(),
        title: p.title,
        slug: p.slug,
        description: p.description,
        category: p.category,
        level: p.level,
        skills: p.skills || [],
        deliverables: p.deliverables || [],
        durationHours: p.durationHours ?? 10
      })),
      total
    };
  }

  ensureDefaultMemoryCatalog();
  let filtered = memoryProjects.filter((p) => p.status === 'published');

  if (rawCat && rawCat.toLowerCase() !== 'all') {
    const lowerCat = rawCat.toLowerCase();
    const matchedCat = memoryCategories.find(
      (cat) => cat.isActive && (cat.slug === lowerCat || cat.name.toLowerCase() === lowerCat)
    );
    filtered = filtered.filter((p) =>
      matchedCat
        ? p.category.toLowerCase() === matchedCat.name.toLowerCase()
        : p.category.toLowerCase() === lowerCat
    );
  }

  if (rawLevel) {
    filtered = filtered.filter((p) => p.level.toLowerCase() === rawLevel.toLowerCase());
  }

  if (rawSearch) {
    const q = rawSearch.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.skills.some((s) => s.toLowerCase().includes(q))
    );
  }

  filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const total = filtered.length;
  const items = filtered.slice(skip, skip + params.limit).map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    category: p.category,
    level: p.level,
    skills: [...p.skills],
    deliverables: [...p.deliverables],
    durationHours: p.durationHours
  }));

  return { items, total };
}

export async function findPublishedProjectBySlug(slug: string) {
  const normalizedSlug = slug.trim().toLowerCase();

  if (isDatabaseConnected()) {
    const p = await ProjectBrief.findOne({ slug: normalizedSlug, status: 'published' }).lean();
    if (!p) return null;
    return {
      id: p._id.toString(),
      title: p.title,
      slug: p.slug,
      description: p.description,
      category: p.category,
      level: p.level,
      skills: p.skills || [],
      deliverables: p.deliverables || [],
      durationHours: p.durationHours ?? 10
    };
  }

  ensureDefaultMemoryCatalog();
  const p = memoryProjects.find((item) => item.slug === normalizedSlug && item.status === 'published');
  if (!p) return null;
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    category: p.category,
    level: p.level,
    skills: [...p.skills],
    deliverables: [...p.deliverables],
    durationHours: p.durationHours
  };
}

// -----------------------------------------------------------------------------
// Course, Module & Lesson ID Lookup Helpers (Used by Step 06 Learner Flow)
// -----------------------------------------------------------------------------
export function setMemoryLessonRightsStatus(
  lessonId: string,
  rightsStatus: ContentRightsStatus
): void {
  ensureDefaultMemoryCatalog();
  const target = memoryLessons.find((l) => l.id === lessonId);
  if (target) {
    target.contentRightsStatus = rightsStatus;
    target.updatedAt = new Date();
  }
}

export async function findPublishedCourseSummaryById(courseId: string) {
  if (!isValidObjectId(courseId)) return null;

  if (isDatabaseConnected()) {
    const c = await Course.findOne({ _id: courseId, status: 'published' }).lean();
    if (!c) return null;
    return {
      id: c._id.toString(),
      title: c.title,
      slug: c.slug,
      summary: c.summary,
      category: c.category,
      level: c.level,
      estimatedDurationHours: c.estimatedDurationHours ?? 4
    };
  }

  ensureDefaultMemoryCatalog();
  const c = memoryCourses.find((item) => item.id === courseId && item.status === 'published');
  if (!c) return null;
  return {
    id: c.id,
    title: c.title,
    slug: c.slug,
    summary: c.summary,
    category: c.category,
    level: c.level,
    estimatedDurationHours: c.estimatedDurationHours
  };
}

export async function findOrderedPublishedLessonsByCourseId(courseId: string): Promise<
  Array<{
    id: string;
    courseId: string;
    moduleId: string;
    moduleTitle: string;
    moduleOrder: number;
    title: string;
    slug: string;
    description: string;
    contentType: LessonContentType;
    durationMinutes: number;
    order: number;
    isRequired: boolean;
    isFreePreview: boolean;
    sourceAttribution: string;
  }>
> {
  if (!isValidObjectId(courseId)) return [];

  if (isDatabaseConnected()) {
    const [modules, lessons] = await Promise.all([
      CourseModule.find({ courseId }).sort({ order: 1 }).lean(),
      Lesson.find({
        courseId,
        $or: [{ status: 'published' }, { status: { $exists: false } }]
      })
        .sort({ order: 1 })
        .lean()
    ]);

    const modMap = new Map(modules.map((m) => [m._id.toString(), m]));
    return lessons
      .map((l) => {
        const mod = modMap.get(l.moduleId.toString());
        return {
          id: l._id.toString(),
          courseId: l.courseId.toString(),
          moduleId: l.moduleId.toString(),
          moduleTitle: mod?.title || 'Module',
          moduleOrder: mod?.order ?? 1,
          title: l.title,
          slug: l.slug,
          description: l.description || '',
          contentType: l.contentType || 'video',
          durationMinutes: l.durationMinutes ?? 15,
          order: l.order,
          isRequired: l.isRequired ?? true,
          isFreePreview: Boolean(l.isFreePreview),
          sourceAttribution: l.sourceAttribution || 'Axivon Curriculum'
        };
      })
      .sort((a, b) => a.moduleOrder - b.moduleOrder || a.order - b.order);
  }

  ensureDefaultMemoryCatalog();
  const modMap = new Map(
    memoryModules.filter((m) => m.courseId === courseId).map((m) => [m.id, m])
  );
  return memoryLessons
    .filter((l) => l.courseId === courseId && l.status === 'published')
    .map((l) => {
      const mod = modMap.get(l.moduleId);
      return {
        id: l.id,
        courseId: l.courseId,
        moduleId: l.moduleId,
        moduleTitle: mod?.title || 'Module',
        moduleOrder: mod?.order ?? 1,
        title: l.title,
        slug: l.slug,
        description: l.description,
        contentType: l.contentType,
        durationMinutes: l.durationMinutes,
        order: l.order,
        isRequired: l.isRequired,
        isFreePreview: l.isFreePreview,
        sourceAttribution: l.sourceAttribution
      };
    })
    .sort((a, b) => a.moduleOrder - b.moduleOrder || a.order - b.order);
}

export async function findOrderedModulesWithLessonsByCourseId(courseId: string) {
  const course = await findPublishedCourseSummaryById(courseId);
  if (!course) return null;

  if (isDatabaseConnected()) {
    const modules = await CourseModule.find({ courseId }).sort({ order: 1 }).lean();
    const orderedLessons = await findOrderedPublishedLessonsByCourseId(courseId);

    return modules.map((mod) => ({
      id: mod._id.toString(),
      courseId,
      title: mod.title,
      description: mod.description || '',
      order: mod.order,
      lessons: orderedLessons
        .filter((l) => l.moduleId === mod._id.toString())
        .map((l) => ({
          id: l.id,
          title: l.title,
          slug: l.slug,
          description: l.description,
          contentType: l.contentType,
          durationMinutes: l.durationMinutes,
          order: l.order,
          isRequired: l.isRequired,
          isFreePreview: l.isFreePreview,
          sourceAttribution: l.sourceAttribution
        }))
    }));
  }

  ensureDefaultMemoryCatalog();
  const orderedLessons = await findOrderedPublishedLessonsByCourseId(courseId);
  return memoryModules
    .filter((m) => m.courseId === courseId)
    .sort((a, b) => a.order - b.order)
    .map((mod) => ({
      id: mod.id,
      courseId,
      title: mod.title,
      description: mod.description,
      order: mod.order,
      lessons: orderedLessons
        .filter((l) => l.moduleId === mod.id)
        .map((l) => ({
          id: l.id,
          title: l.title,
          slug: l.slug,
          description: l.description,
          contentType: l.contentType,
          durationMinutes: l.durationMinutes,
          order: l.order,
          isRequired: l.isRequired,
          isFreePreview: l.isFreePreview,
          sourceAttribution: l.sourceAttribution
        }))
    }));
}

export async function findPublishedLessonWithCourseById(lessonId: string): Promise<{
  lesson: StoredLessonRecord;
  course: {
    id: string;
    title: string;
    slug: string;
    category: string;
    level: CourseLevel;
    estimatedDurationHours: number;
  };
} | null> {
  if (!isValidObjectId(lessonId)) return null;

  if (isDatabaseConnected()) {
    const l = await Lesson.findById(lessonId).lean();
    if (!l || l.status === 'draft') return null;

    const c = await Course.findOne({ _id: l.courseId, status: 'published' }).lean();
    if (!c) return null;

    return {
      lesson: {
        id: l._id.toString(),
        courseId: l.courseId.toString(),
        moduleId: l.moduleId.toString(),
        title: l.title,
        slug: l.slug,
        description: l.description || '',
        contentType: l.contentType || 'video',
        videoProvider: l.videoProvider || 'youtube',
        videoUrl: l.videoUrl || '',
        videoEmbedId: l.videoEmbedId || '',
        resourceUrl: l.resourceUrl || '',
        resourceLinks: l.resourceLinks || [],
        sourceAttribution: l.sourceAttribution || 'Axivon Curriculum',
        contentRightsStatus: l.contentRightsStatus || 'permitted_embed',
        durationMinutes: l.durationMinutes ?? 15,
        order: l.order,
        isRequired: l.isRequired ?? true,
        isFreePreview: Boolean(l.isFreePreview),
        status: (l.status || 'published') as LessonStatus,
        createdAt: l.createdAt,
        updatedAt: l.updatedAt
      },
      course: {
        id: c._id.toString(),
        title: c.title,
        slug: c.slug,
        category: c.category,
        level: c.level,
        estimatedDurationHours: c.estimatedDurationHours ?? 4
      }
    };
  }

  ensureDefaultMemoryCatalog();
  const l = memoryLessons.find((item) => item.id === lessonId && item.status === 'published');
  if (!l) return null;

  const c = memoryCourses.find((item) => item.id === l.courseId && item.status === 'published');
  if (!c) return null;

  return {
    lesson: {
      ...l,
      resourceLinks: [...l.resourceLinks]
    },
    course: {
      id: c.id,
      title: c.title,
      slug: c.slug,
      category: c.category,
      level: c.level,
      estimatedDurationHours: c.estimatedDurationHours
    }
  };
}
