import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import { connectDatabase, disconnectDatabase } from './connection';
import { User } from './models/User';
import { Category } from './models/Category';
import { Course } from './models/Course';
import { CourseModule } from './models/CourseModule';
import { Lesson } from './models/Lesson';
import { Enrollment } from './models/Enrollment';
import { LessonProgress } from './models/LessonProgress';
import { Quiz } from './models/Quiz';
import { QuizQuestion } from './models/QuizQuestion';
import { QuizAttempt } from './models/QuizAttempt';
import { LearningPath } from './models/LearningPath';
import { ProjectBrief } from './models/ProjectBrief';

async function seed() {
  console.log('[Seed] Starting AXIVON LEARN database seed procedure...');

  if (env.NODE_ENV === 'production' && process.env.ALLOW_DESTRUCTIVE_SEED !== 'true') {
    console.error(
      '[Seed] Refusing destructive seed in production environment (set ALLOW_DESTRUCTIVE_SEED=true only for initial empty provisioning).'
    );
    process.exit(1);
  }

  if (
    env.NODE_ENV === 'production' &&
    (!process.env.SEED_ADMIN_EMAIL || !process.env.SEED_ADMIN_PASSWORD)
  ) {
    console.error(
      '[Seed] SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be provided via environment variables in production.'
    );
    process.exit(1);
  }

  const connected = await connectDatabase();
  if (!connected) {
    console.error(
      '[Seed] Database connection failed. Please ensure MongoDB is running and MONGODB_URI is valid.'
    );
    process.exit(1);
  }

  try {
    // 1. Clear existing collections in local/dev seed reset
    await Promise.all([
      QuizAttempt.deleteMany({}),
      LessonProgress.deleteMany({}),
      Enrollment.deleteMany({}),
      QuizQuestion.deleteMany({}),
      Quiz.deleteMany({}),
      Lesson.deleteMany({}),
      CourseModule.deleteMany({}),
      LearningPath.deleteMany({}),
      ProjectBrief.deleteMany({}),
      Course.deleteMany({}),
      Category.deleteMany({}),
      User.deleteMany({})
    ]);
    console.log('[Seed] Cleared existing records across all 12 collections.');

    // 2. Seed Users (supports env overrides so credentials are never hard-coded in staging/prod)
    const adminEmail = (process.env.SEED_ADMIN_EMAIL || 'admin@axivon.local').trim().toLowerCase();
    const adminPlain = process.env.SEED_ADMIN_PASSWORD || 'AxivonAdmin2026!';
    const learnerEmail = (process.env.SEED_LEARNER_EMAIL || 'learner@axivon.local')
      .trim()
      .toLowerCase();
    const learnerPlain = process.env.SEED_LEARNER_PASSWORD || 'AxivonLearner2026!';

    const [adminPasswordHash, learnerPasswordHash] = await Promise.all([
      bcrypt.hash(adminPlain, 10),
      bcrypt.hash(learnerPlain, 10)
    ]);

    const admin = await User.create({
      name: 'Platform Administrator',
      email: adminEmail,
      passwordHash: adminPasswordHash,
      role: 'admin',
      isActive: true
    });

    const learner = await User.create({
      name: 'Alex Johnson',
      email: learnerEmail,
      passwordHash: learnerPasswordHash,
      role: 'learner',
      isActive: true
    });
    console.log(`[Seed] Seeded Users: ${admin.email} (admin), ${learner.email} (learner)`);

    // 3. Seed Categories
    const [catAI, catWeb, catCloud] = await Promise.all([
      Category.create({
        name: 'AI & Machine Learning',
        slug: 'ai-ml',
        description:
          'Foundations and practical applications in data science, ML, and neural networks.',
        icon: 'cpu',
        sortOrder: 1,
        isActive: true
      }),
      Category.create({
        name: 'Web Development',
        slug: 'web-development',
        description: 'Modern full-stack web applications, TypeScript, React, and REST APIs.',
        icon: 'code',
        sortOrder: 2,
        isActive: true
      }),
      Category.create({
        name: 'Cloud & DevOps',
        slug: 'cloud-devops',
        description:
          'Continuous integration, containerization, and cloud deployment pipelines.',
        icon: 'cloud',
        sortOrder: 3,
        isActive: true
      })
    ]);
    console.log('[Seed] Seeded Categories (3 active).');

    const now = new Date();

    // 4. Seed Course 1: AI & Machine Learning Foundations (Published)
    const courseAI = await Course.create({
      title: 'AI & Machine Learning Foundations',
      slug: 'ai-ml-foundations',
      summary:
        'Master foundational Python, NumPy, Pandas, regression models, and neural network basics.',
      description:
        'A complete practical overview of modern AI. Learn core linear algebra, statistical learning, and model evaluation techniques.',
      category: catAI.name,
      categoryId: catAI._id,
      level: 'beginner',
      language: 'English',
      instructorName: 'Axivon Technologies',
      sourceAttribution: 'Axivon Curriculum & Permitted Educational Resources',
      status: 'published',
      outcomes: [
        'Understand Python data structures for ML',
        'Train regression and classification algorithms',
        'Evaluate models using precision, recall, and loss curves'
      ],
      prerequisites: ['Basic programming knowledge'],
      estimatedDurationHours: 6,
      publishedAt: now
    });

    const modAI1 = await CourseModule.create({
      courseId: courseAI._id,
      title: 'Module 1: Introduction to Machine Learning',
      description: 'Core concepts, workflows, and environment setup',
      order: 1
    });

    const modAI2 = await CourseModule.create({
      courseId: courseAI._id,
      title: 'Module 2: Supervised Learning & Evaluation',
      description: 'Regression, classification, and validation metrics',
      order: 2
    });

    const lessonAI1 = await Lesson.create({
      courseId: courseAI._id,
      moduleId: modAI1._id,
      title: '1.1 What is Machine Learning?',
      slug: 'what-is-machine-learning',
      description: 'Supervised vs. unsupervised learning paradigms and mathematical concepts.',
      contentType: 'video',
      videoProvider: 'youtube',
      videoUrl: 'https://www.youtube.com/watch?v=ukzFI9rgwfU',
      videoEmbedId: 'ukzFI9rgwfU',
      resourceLinks: [
        {
          title: 'Scikit-Learn User Guide',
          url: 'https://scikit-learn.org/stable/user_guide.html'
        }
      ],
      sourceAttribution: 'Axivon Curriculum (Permitted YouTube Educational Embed)',
      contentRightsStatus: 'permitted_embed',
      durationMinutes: 20,
      order: 1,
      isRequired: true,
      isFreePreview: true,
      status: 'published'
    });

    await Lesson.create({
      courseId: courseAI._id,
      moduleId: modAI2._id,
      title: '2.1 Training Your First Regression Model',
      slug: 'training-first-regression-model',
      description: 'Hands-on feature scaling, train/test splitting, and mean squared error.',
      contentType: 'article',
      videoProvider: 'none',
      resourceUrl: 'https://numpy.org/doc/stable/',
      resourceLinks: [
        { title: 'NumPy Official Documentation', url: 'https://numpy.org/doc/stable/' }
      ],
      sourceAttribution: 'Axivon Curriculum (Owned Article)',
      contentRightsStatus: 'owned',
      durationMinutes: 30,
      order: 1,
      isRequired: true,
      isFreePreview: false,
      status: 'published'
    });

    const quizAI = await Quiz.create({
      courseId: courseAI._id,
      moduleId: modAI1._id,
      lessonId: lessonAI1._id,
      title: 'AI Module 1 Concept Check',
      description: 'Assess foundational ML definitions, train/test splits, and loss metrics.',
      passingScore: 2,
      status: 'published'
    });

    await QuizQuestion.insertMany([
      {
        quizId: quizAI._id,
        prompt: 'Which learning paradigm relies on labeled training datasets?',
        options: [
          'Unsupervised Learning',
          'Supervised Learning',
          'Clustering without labels',
          'Random Walk'
        ],
        correctOptionIndex: 1,
        explanation: 'Supervised learning algorithms map inputs to known labeled outputs.',
        order: 1
      },
      {
        quizId: quizAI._id,
        prompt: 'Why do we hold out a separate test dataset during model evaluation?',
        options: [
          'To measure generalization on unseen data and detect overfitting',
          'To skip feature scaling',
          'To increase training loss intentionally',
          'To avoid saving model weights'
        ],
        correctOptionIndex: 0,
        explanation: 'Held-out test data verifies whether the model generalizes beyond training examples.',
        order: 2
      },
      {
        quizId: quizAI._id,
        prompt: 'Which loss metric is commonly minimized in linear regression?',
        options: ['Mean Squared Error (MSE)', 'HTTP Status Code', 'DOM Depth', 'DNS TTL'],
        correctOptionIndex: 0,
        explanation: 'MSE measures the average squared difference between predicted and actual values.',
        order: 3
      }
    ]);

    // 5. Seed Course 2: Full Stack Web Development (Published)
    const courseWeb = await Course.create({
      title: 'Full Stack Web Development',
      slug: 'full-stack-web-development',
      summary:
        'Build end-to-end web applications with React, TypeScript, Node.js, Express, and MongoDB.',
      description:
        'Learn modern web architecture from HTTP protocols to responsive layouts and scalable REST APIs.',
      category: catWeb.name,
      categoryId: catWeb._id,
      level: 'intermediate',
      language: 'English',
      instructorName: 'Axivon Technologies',
      sourceAttribution: 'Axivon Curriculum & Permitted Educational Resources',
      status: 'published',
      outcomes: [
        'Design responsive component systems in React',
        'Build modular RESTful API endpoints in Express',
        'Model document databases with Mongoose schemas'
      ],
      prerequisites: ['Basic HTML and JavaScript familiarity'],
      estimatedDurationHours: 8,
      publishedAt: now
    });

    const modWeb1 = await CourseModule.create({
      courseId: courseWeb._id,
      title: 'Module 1: Web Architecture & RESTful APIs',
      description: 'Client-server communications, HTTP semantics, and monorepo boundaries',
      order: 1
    });

    const modWeb2 = await CourseModule.create({
      courseId: courseWeb._id,
      title: 'Module 2: Authentication, RBAC & Persistence',
      description: 'JWT sessions, ownership guards, and Mongoose indexing',
      order: 2
    });

    const lessonWeb1 = await Lesson.create({
      courseId: courseWeb._id,
      moduleId: modWeb1._id,
      title: '1.1 REST Protocol & Modular Architecture',
      slug: 'rest-protocol-architecture',
      description: 'Standard HTTP methods, headers, status codes, and monorepo structure.',
      contentType: 'video',
      videoProvider: 'youtube',
      videoUrl: 'https://www.youtube.com/watch?v=-MTSQjw5DrM',
      videoEmbedId: '-MTSQjw5DrM',
      resourceLinks: [
        {
          title: 'MDN HTTP Overview',
          url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview'
        }
      ],
      sourceAttribution: 'Axivon Curriculum (Permitted YouTube Educational Embed)',
      contentRightsStatus: 'permitted_embed',
      durationMinutes: 25,
      order: 1,
      isRequired: true,
      isFreePreview: true,
      status: 'published'
    });

    await Lesson.create({
      courseId: courseWeb._id,
      moduleId: modWeb2._id,
      title: '2.1 Authentication, JWTs & Ownership Guards',
      slug: 'authentication-jwts-ownership-guards',
      description: 'Designing secure session flows, RBAC middleware, and horizontal ownership checks.',
      contentType: 'article',
      videoProvider: 'none',
      resourceUrl: 'https://expressjs.com/en/advanced/best-practice-security.html',
      resourceLinks: [
        {
          title: 'Express Security Best Practices',
          url: 'https://expressjs.com/en/advanced/best-practice-security.html'
        }
      ],
      sourceAttribution: 'Axivon Curriculum (Owned Article)',
      contentRightsStatus: 'owned',
      durationMinutes: 35,
      order: 1,
      isRequired: true,
      isFreePreview: false,
      status: 'published'
    });

    const quizWeb = await Quiz.create({
      courseId: courseWeb._id,
      moduleId: modWeb1._id,
      lessonId: lessonWeb1._id,
      title: 'Web Architecture Module 1 Assessment',
      description: 'Check understanding of REST methods, shared contracts, and RBAC enforcement.',
      passingScore: 2,
      status: 'published'
    });

    await QuizQuestion.insertMany([
      {
        quizId: quizWeb._id,
        prompt: 'Which HTTP method should be used for idempotent full resource replacement?',
        options: ['POST', 'PUT', 'PATCH', 'CONNECT'],
        correctOptionIndex: 1,
        explanation: 'PUT replaces an existing resource representation idempotently.',
        order: 1
      },
      {
        quizId: quizWeb._id,
        prompt: 'Where must role-based authorization (RBAC) be enforced to guarantee security?',
        options: [
          'Only by hiding admin buttons in the React UI',
          'On the backend API middleware for every protected endpoint',
          'Inside CSS stylesheets',
          'Only in browser localStorage'
        ],
        correctOptionIndex: 1,
        explanation: 'Client UI checks can be bypassed; backend authorization is mandatory.',
        order: 2
      },
      {
        quizId: quizWeb._id,
        prompt: 'Why is correctOptionIndex excluded from GET /api/v1/quizzes/:quizId responses?',
        options: [
          'To prevent learners from inspecting the answer key in network DevTools before submitting',
          'Because JSON does not support integers',
          'To disable server-side grading',
          'Because quizzes have no options'
        ],
        correctOptionIndex: 0,
        explanation: 'Withholding answer keys pre-submit and grading on the server prevents client tampering.',
        order: 3
      }
    ]);

    // 6. Seed Sample Draft Course & Draft Quiz (For Admin CMS Authoring Verification)
    const draftCourse = await Course.create({
      title: 'Cloud Native CI/CD Pipelines (Authoring Draft)',
      slug: 'cloud-native-cicd-draft',
      summary: 'Upcoming DevOps track currently in curriculum review (hidden from public catalog).',
      description: 'Container builds, automated testing gates, and zero-downtime rollbacks.',
      category: catCloud.name,
      categoryId: catCloud._id,
      level: 'advanced',
      language: 'English',
      instructorName: 'Axivon Technologies',
      sourceAttribution: 'Axivon Curriculum',
      status: 'draft',
      outcomes: ['Automate multi-stage CI pipelines', 'Execute safe deployment rollbacks'],
      prerequisites: ['Git and Linux fundamentals'],
      estimatedDurationHours: 10
    });

    await Quiz.create({
      courseId: draftCourse._id,
      title: 'Draft Assessment: Deployment Rollback Readiness',
      description: 'Unpublished assessment visible only in Admin CMS.',
      passingScore: 1,
      status: 'draft'
    });
    console.log('[Seed] Seeded Courses (2 published, 1 draft), Modules, Lessons, and Quizzes.');

    // 7. Seed Learning Paths
    await LearningPath.insertMany([
      {
        title: 'AI & Machine Learning Foundations',
        slug: 'ai-ml-path',
        description: 'Step-by-step track from Python foundations to working neural network models.',
        courseIds: [courseAI._id],
        estimatedHours: 40,
        level: 'Beginner to Intermediate',
        status: 'published'
      },
      {
        title: 'Full Stack Web Development',
        slug: 'full-stack-path',
        description:
          'Complete roadmap covering client components, servers, authentication, and databases.',
        courseIds: [courseWeb._id],
        estimatedHours: 50,
        level: 'Beginner to Advanced',
        status: 'published'
      }
    ]);
    console.log('[Seed] Seeded Learning Paths (2 published).');

    // 8. Seed Project Briefs
    await ProjectBrief.insertMany([
      {
        title: 'Modular EdTech REST API Service',
        slug: 'modular-edtech-rest-api',
        description:
          'Design and build a secure Express + TypeScript + MongoDB API with RBAC, Zod validation, and automated Supertest suites.',
        category: catWeb.name,
        level: 'Intermediate',
        skills: ['TypeScript', 'Node.js', 'Express', 'MongoDB', 'Supertest'],
        deliverables: [
          'Modular API endpoints across 12 domains',
          'Authentication, RBAC & horizontal ownership guards',
          'Automated integration test suite'
        ],
        durationHours: 12,
        status: 'published'
      },
      {
        title: 'Customer Churn Prediction Pipeline',
        slug: 'customer-churn-prediction-pipeline',
        description:
          'Preprocess tabular customer datasets, train classification models, and evaluate precision-recall trade-offs.',
        category: catAI.name,
        level: 'Beginner',
        skills: ['Python', 'Pandas', 'Scikit-Learn', 'Model Evaluation'],
        deliverables: [
          'Cleaned feature engineering notebook',
          'Trained baseline & ensemble classifiers',
          'Evaluation metrics summary report'
        ],
        durationHours: 8,
        status: 'published'
      }
    ]);
    console.log('[Seed] Seeded Project Briefs (2 published).');

    console.log('[Seed] Database seeding completed successfully!');
  } catch (err: any) {
    console.error('[Seed] Error during seeding:', err?.message || err);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
}

seed();
