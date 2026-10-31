import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from './connection';
import { User } from './models/User';
import { Category } from './models/Category';
import { Course } from './models/Course';
import { CourseModule } from './models/CourseModule';
import { Lesson } from './models/Lesson';
import { Quiz } from './models/Quiz';
import { QuizQuestion } from './models/QuizQuestion';
import { LearningPath } from './models/LearningPath';

async function seed() {
  console.log('[Seed] Starting AXIVON LEARN database seed procedure...');
  const connected = await connectDatabase();
  if (!connected) {
    console.error('[Seed] Database connection failed. Please ensure MongoDB is running and MONGODB_URI is valid.');
    process.exit(1);
  }

  try {
    // 1. Clear existing seed collections
    await User.deleteMany({});
    await Category.deleteMany({});
    await Course.deleteMany({});
    await CourseModule.deleteMany({});
    await Lesson.deleteMany({});
    await Quiz.deleteMany({});
    await QuizQuestion.deleteMany({});
    await LearningPath.deleteMany({});
    console.log('[Seed] Cleared existing records.');

    // 2. Seed Users
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('AxivonAdmin2026!', salt);
    const learnerPasswordHash = await bcrypt.hash('AxivonLearner2026!', salt);

    const admin = await User.create({
      name: 'Platform Administrator',
      email: 'admin@axivon.local',
      passwordHash: adminPasswordHash,
      role: 'admin'
    });

    const learner = await User.create({
      name: 'Alex Johnson',
      email: 'learner@axivon.local',
      passwordHash: learnerPasswordHash,
      role: 'learner'
    });
    console.log(`[Seed] Seeded Users: ${admin.email} (admin), ${learner.email} (learner)`);

    // 3. Seed Categories
    const catAI = await Category.create({
      name: 'AI & Machine Learning',
      slug: 'ai-ml',
      description: 'Foundations and advanced applications in data science, ML, and neural networks.'
    });

    const catWeb = await Category.create({
      name: 'Web Development',
      slug: 'web-development',
      description: 'Modern full-stack web applications, TypeScript, React, and REST APIs.'
    });

    await Category.create({
      name: 'Cloud & DevOps',
      slug: 'cloud-devops',
      description: 'Continuous integration, containerization, and cloud deployment pipelines.'
    });
    console.log('[Seed] Seeded Categories.');

    // 4. Seed Course 1: AI & ML Foundations
    const courseAI = await Course.create({
      title: 'AI & Machine Learning Foundations',
      slug: 'ai-ml-foundations',
      summary: 'Master foundational Python, NumPy, Pandas, regression models, and neural network basics.',
      description: 'A complete practical overview of modern AI. Learn core linear algebra, statistical learning, and model evaluation techniques.',
      category: catAI.name,
      level: 'beginner',
      status: 'published',
      outcomes: [
        'Understand Python data structures for ML',
        'Train regression and classification algorithms',
        'Evaluate models using precision, recall, and loss curves'
      ],
      prerequisites: ['Basic programming knowledge'],
      estimatedDurationHours: 6
    });

    const modAI = await CourseModule.create({
      courseId: courseAI._id,
      title: 'Module 1: Introduction to Machine Learning',
      description: 'Core concepts and environment setup',
      order: 1
    });

    const lessonAI1 = await Lesson.create({
      courseId: courseAI._id,
      moduleId: modAI._id,
      title: '1.1 What is Machine Learning?',
      slug: 'what-is-machine-learning',
      description: 'Supervised vs. unsupervised learning paradigms and mathematical concepts.',
      durationMinutes: 20,
      order: 1,
      isFreePreview: true
    });

    const quizAI = await Quiz.create({
      courseId: courseAI._id,
      moduleId: modAI._id,
      lessonId: lessonAI1._id,
      title: 'AI Module 1 Concept Check',
      description: 'Assess basic ML definitions and workflows',
      passingScore: 1
    });

    await QuizQuestion.create({
      quizId: quizAI._id,
      prompt: 'Which learning paradigm relies on labeled training datasets?',
      options: ['Unsupervised Learning', 'Supervised Learning', 'Reinforcement Learning without rewards', 'Random Walk'],
      correctOptionIndex: 1,
      explanation: 'Supervised learning algorithms map inputs to known labeled outputs.',
      order: 1
    });

    // 5. Seed Course 2: Full Stack Web Development
    const courseWeb = await Course.create({
      title: 'Full Stack Web Development',
      slug: 'full-stack-web-development',
      summary: 'Build end-to-end web applications with React, TypeScript, Node.js, Express, and MongoDB.',
      description: 'Learn modern web architecture from HTTP protocols to responsive layouts and scalable REST APIs.',
      category: catWeb.name,
      level: 'beginner',
      status: 'published',
      outcomes: [
        'Design responsive component systems in React',
        'Build modular RESTful API endpoints in Express',
        'Model document databases with Mongoose schemas'
      ],
      prerequisites: ['Basic HTML and JavaScript familiarity'],
      estimatedDurationHours: 8
    });

    const modWeb = await CourseModule.create({
      courseId: courseWeb._id,
      title: 'Module 1: Web Architecture & RESTful APIs',
      description: 'Client-server communications and HTTP protocols',
      order: 1
    });

    const lessonWeb1 = await Lesson.create({
      courseId: courseWeb._id,
      moduleId: modWeb._id,
      title: '1.1 REST Protocol & Modular Architecture',
      slug: 'rest-protocol-architecture',
      description: 'Standard HTTP methods, headers, status codes, and monorepo structure.',
      durationMinutes: 25,
      order: 1,
      isFreePreview: true
    });

    const quizWeb = await Quiz.create({
      courseId: courseWeb._id,
      moduleId: modWeb._id,
      lessonId: lessonWeb1._id,
      title: 'Web Architecture Module 1 Assessment',
      description: 'Check understanding of REST methods and architecture',
      passingScore: 1
    });

    await QuizQuestion.create({
      quizId: quizWeb._id,
      prompt: 'Which HTTP method should be used for idempotent resource replacement?',
      options: ['POST', 'PUT', 'PATCH', 'CONNECT'],
      correctOptionIndex: 1,
      explanation: 'PUT replaces an existing resource representation or creates it if idempotent.',
      order: 1
    });

    // 6. Seed Learning Paths
    await LearningPath.create({
      title: 'AI & Machine Learning Foundations',
      slug: 'ai-ml-path',
      description: 'Step-by-step track from Python foundations to working neural network models.',
      courseIds: [courseAI._id],
      estimatedHours: 40,
      level: 'Beginner to Intermediate',
      status: 'published'
    });

    await LearningPath.create({
      title: 'Full Stack Web Development',
      slug: 'full-stack-path',
      description: 'Complete roadmap covering client components, servers, authentication, and databases.',
      courseIds: [courseWeb._id],
      estimatedHours: 50,
      level: 'Beginner to Advanced',
      status: 'published'
    });

    console.log('[Seed] Database seeding completed successfully!');
  } catch (err: any) {
    console.error('[Seed] Error during seeding:', err);
  } finally {
    await disconnectDatabase();
  }
}

// Execute seed if called directly
seed();
