import { AppError } from '../../middleware/errorHandler';
import { AuthenticatedUser } from '../../middleware/authenticate';
import {
  findPublishedCourseSummaryById,
  findOrderedPublishedLessonsByCourseId,
  findPublishedLessonWithCourseById
} from '../courses/catalog.store';
import {
  isUserEnrolledInCourse,
  findUserLessonProgressMapForCourse,
  recordEnrolledLessonView
} from '../enrollments/learner.store';

export async function listCourseLessonsForViewer(
  courseId: string,
  viewer?: AuthenticatedUser
) {
  const course = await findPublishedCourseSummaryById(courseId);
  if (!course) {
    throw new AppError('Published course not found.', 404, undefined, 'NOT_FOUND');
  }

  const isAdmin = viewer?.role === 'admin';
  const isEnrolled = viewer ? await isUserEnrolledInCourse(viewer.id, courseId) : false;
  const progressMap = viewer
    ? await findUserLessonProgressMapForCourse(viewer.id, courseId)
    : new Map();

  const orderedLessons = await findOrderedPublishedLessonsByCourseId(courseId);

  return {
    course,
    isEnrolled,
    lessons: orderedLessons.map((lesson) => {
      const prog = progressMap.get(lesson.id);
      const isUnlocked = lesson.isFreePreview || isEnrolled || isAdmin;
      return {
        ...lesson,
        isLocked: !isUnlocked,
        progressStatus: prog?.status || 'not_started',
        completedAt: prog?.completedAt || null
      };
    })
  };
}

export async function getLessonDetailForViewer(
  lessonId: string,
  viewer?: AuthenticatedUser
) {
  const resolved = await findPublishedLessonWithCourseById(lessonId);
  if (!resolved) {
    throw new AppError('Lesson not found.', 404, undefined, 'NOT_FOUND');
  }

  const { lesson, course } = resolved;
  const isAdmin = viewer?.role === 'admin';
  const isEnrolled = viewer ? await isUserEnrolledInCourse(viewer.id, course.id) : false;

  if (!lesson.isFreePreview && !isAdmin) {
    if (!viewer) {
      throw new AppError(
        'Authentication required to access this lesson.',
        401,
        undefined,
        'UNAUTHORIZED'
      );
    }
    if (!isEnrolled) {
      throw new AppError(
        'Course enrollment required to access this lesson.',
        403,
        undefined,
        'FORBIDDEN'
      );
    }
  }

  if (viewer && isEnrolled) {
    await recordEnrolledLessonView(viewer.id, course.id, lesson.id);
  }

  const orderedLessons = await findOrderedPublishedLessonsByCourseId(course.id);
  const currentIdx = orderedLessons.findIndex((l) => l.id === lesson.id);
  const previousLessonId = currentIdx > 0 ? orderedLessons[currentIdx - 1].id : null;
  const nextLessonId =
    currentIdx >= 0 && currentIdx < orderedLessons.length - 1
      ? orderedLessons[currentIdx + 1].id
      : null;

  const progressMap = viewer
    ? await findUserLessonProgressMapForCourse(viewer.id, course.id)
    : new Map();
  const lessonProgress = progressMap.get(lesson.id) || null;

  // Enforce video rights & safe fallback policy (Spec Section 10 & Minimum QA Matrix)
  const rightsPermitted =
    lesson.contentRightsStatus === 'permitted_embed' ||
    lesson.contentRightsStatus === 'licensed' ||
    lesson.contentRightsStatus === 'owned';

  const hasYoutubeEmbed =
    rightsPermitted &&
    lesson.videoProvider === 'youtube' &&
    Boolean(lesson.videoEmbedId && lesson.videoEmbedId.trim());

  const embedAllowed = rightsPermitted && lesson.videoProvider !== 'none';
  const videoEmbedUrl = hasYoutubeEmbed
    ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(lesson.videoEmbedId.trim())}`
    : '';

  const fallbackNotice = !rightsPermitted
    ? 'Embedded media is temporarily unavailable pending rights verification. Please use the study notes and official reference links below.'
    : null;

  return {
    id: lesson.id,
    courseId: lesson.courseId,
    moduleId: lesson.moduleId,
    title: lesson.title,
    slug: lesson.slug,
    description: lesson.description,
    contentType: lesson.contentType,
    videoProvider: rightsPermitted ? lesson.videoProvider : 'none',
    embedAllowed,
    videoUrl: rightsPermitted ? lesson.videoUrl : '',
    videoEmbedId: rightsPermitted ? lesson.videoEmbedId : '',
    videoEmbedUrl,
    fallbackNotice,
    resourceUrl: lesson.resourceUrl,
    resourceLinks: lesson.resourceLinks,
    sourceAttribution: lesson.sourceAttribution,
    contentRightsStatus: lesson.contentRightsStatus,
    durationMinutes: lesson.durationMinutes,
    order: lesson.order,
    isRequired: lesson.isRequired,
    isFreePreview: lesson.isFreePreview,
    course,
    navigation: {
      previousLessonId,
      nextLessonId,
      totalCourseLessons: orderedLessons.length
    },
    progress: lessonProgress
  };
}
