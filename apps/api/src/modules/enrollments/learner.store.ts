import mongoose from 'mongoose';
import { isDatabaseConnected } from '../../database/connection';
import { Enrollment } from '../../database/models/Enrollment';
import { LessonProgress, LessonProgressStatus } from '../../database/models/LessonProgress';
import { isValidObjectId } from '../../utils/objectId';
import {
  findPublishedCourseSummaryById,
  findOrderedPublishedLessonsByCourseId
} from '../courses/catalog.store';

export interface StoredEnrollmentRecord {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  completedLessons: string[];
  progressPercent: number;
  lastAccessedLessonId: string | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoredLessonProgressRecord {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  status: LessonProgressStatus;
  completedAt: Date | null;
  lastViewedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Fallback In-Memory Learner Store (Used ONLY when MongoDB is disconnected in CI/tests)
// -----------------------------------------------------------------------------
const memoryEnrollments = new Map<string, StoredEnrollmentRecord>();
const memoryLessonProgress = new Map<string, StoredLessonProgressRecord>();

function enrollmentKey(userId: string, courseId: string): string {
  return `${userId}:${courseId}`;
}

function progressKey(userId: string, lessonId: string): string {
  return `${userId}:${lessonId}`;
}

export function resetMemoryLearnerState(): void {
  memoryEnrollments.clear();
  memoryLessonProgress.clear();
}

export async function isUserEnrolledInCourse(userId: string, courseId: string): Promise<boolean> {
  if (!isValidObjectId(userId) || !isValidObjectId(courseId)) return false;

  if (isDatabaseConnected()) {
    const existing = await Enrollment.exists({ userId, courseId });
    return Boolean(existing);
  }

  return memoryEnrollments.has(enrollmentKey(userId, courseId));
}

async function recomputeAndSyncEnrollment(
  userId: string,
  courseId: string,
  lastAccessedLessonId?: string
): Promise<StoredEnrollmentRecord | null> {
  const orderedLessons = await findOrderedPublishedLessonsByCourseId(courseId);
  const publishedLessonIdSet = new Set(orderedLessons.map((l) => l.id));
  const totalLessons = orderedLessons.length;

  if (isDatabaseConnected()) {
    const enrollmentDoc = await Enrollment.findOne({ userId, courseId });
    if (!enrollmentDoc) return null;

    const completedDocs = await LessonProgress.find({
      userId,
      courseId,
      status: 'completed'
    }).lean();

    const completedIds = completedDocs
      .map((d) => d.lessonId.toString())
      .filter((id) => publishedLessonIdSet.has(id));

    const uniqueCompletedIds = Array.from(new Set(completedIds));
    const progressPercent =
      totalLessons > 0
        ? Math.min(100, Math.round((uniqueCompletedIds.length / totalLessons) * 100))
        : 0;

    const allDone = totalLessons > 0 && uniqueCompletedIds.length >= totalLessons;

    enrollmentDoc.completedLessons = uniqueCompletedIds.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    enrollmentDoc.progressPercent = progressPercent;
    if (lastAccessedLessonId && isValidObjectId(lastAccessedLessonId)) {
      enrollmentDoc.lastAccessedLessonId = new mongoose.Types.ObjectId(lastAccessedLessonId);
    }
    if (allDone) {
      enrollmentDoc.completedAt = enrollmentDoc.completedAt || new Date();
    } else {
      enrollmentDoc.completedAt = undefined;
    }

    await enrollmentDoc.save();

    return {
      id: enrollmentDoc._id.toString(),
      userId: enrollmentDoc.userId.toString(),
      courseId: enrollmentDoc.courseId.toString(),
      enrolledAt: enrollmentDoc.enrolledAt,
      completedLessons: uniqueCompletedIds,
      progressPercent: enrollmentDoc.progressPercent,
      lastAccessedLessonId: enrollmentDoc.lastAccessedLessonId
        ? enrollmentDoc.lastAccessedLessonId.toString()
        : null,
      completedAt: enrollmentDoc.completedAt ?? null,
      createdAt: enrollmentDoc.createdAt,
      updatedAt: enrollmentDoc.updatedAt
    };
  }

  const key = enrollmentKey(userId, courseId);
  const existing = memoryEnrollments.get(key);
  if (!existing) return null;

  const completedIds: string[] = [];
  for (const rec of memoryLessonProgress.values()) {
    if (
      rec.userId === userId &&
      rec.courseId === courseId &&
      rec.status === 'completed' &&
      publishedLessonIdSet.has(rec.lessonId)
    ) {
      completedIds.push(rec.lessonId);
    }
  }

  const uniqueCompletedIds = Array.from(new Set(completedIds));
  const progressPercent =
    totalLessons > 0
      ? Math.min(100, Math.round((uniqueCompletedIds.length / totalLessons) * 100))
      : 0;
  const allDone = totalLessons > 0 && uniqueCompletedIds.length >= totalLessons;

  existing.completedLessons = uniqueCompletedIds;
  existing.progressPercent = progressPercent;
  if (lastAccessedLessonId) {
    existing.lastAccessedLessonId = lastAccessedLessonId;
  }
  if (allDone) {
    existing.completedAt = existing.completedAt || new Date();
  } else {
    existing.completedAt = null;
  }
  existing.updatedAt = new Date();

  return {
    ...existing,
    completedLessons: [...existing.completedLessons]
  };
}

export async function formatEnrichedEnrollment(record: StoredEnrollmentRecord) {
  const [course, orderedLessons] = await Promise.all([
    findPublishedCourseSummaryById(record.courseId),
    findOrderedPublishedLessonsByCourseId(record.courseId)
  ]);

  const completedSet = new Set(record.completedLessons);
  const totalLessons = orderedLessons.length;
  const completedLessonsCount = orderedLessons.filter((l) => completedSet.has(l.id)).length;
  const progressPercent =
    totalLessons > 0
      ? Math.min(100, Math.round((completedLessonsCount / totalLessons) * 100))
      : 0;

  const nextCandidate =
    orderedLessons.find((l) => !completedSet.has(l.id)) || orderedLessons[0] || null;

  return {
    id: record.id,
    userId: record.userId,
    courseId: record.courseId,
    status:
      totalLessons > 0 && completedLessonsCount >= totalLessons
        ? ('completed' as const)
        : ('in_progress' as const),
    enrolledAt: record.enrolledAt.toISOString(),
    progressPercent,
    completedLessonsCount,
    totalLessons,
    completedLessonIds: orderedLessons.filter((l) => completedSet.has(l.id)).map((l) => l.id),
    lastAccessedLessonId: record.lastAccessedLessonId,
    completedAt: record.completedAt ? record.completedAt.toISOString() : null,
    nextLesson: nextCandidate
      ? {
          id: nextCandidate.id,
          title: nextCandidate.title,
          slug: nextCandidate.slug
        }
      : null,
    course
  };
}

export async function enrollUserInPublishedCourse(
  userId: string,
  courseId: string
): Promise<{
  created: boolean;
  enrollment: Awaited<ReturnType<typeof formatEnrichedEnrollment>>;
}> {
  if (isDatabaseConnected()) {
    const existingDoc = await Enrollment.findOne({ userId, courseId });
    if (existingDoc) {
      const synced = await recomputeAndSyncEnrollment(userId, courseId);
      const formatted = await formatEnrichedEnrollment(synced!);
      return { created: false, enrollment: formatted };
    }

    const createdDoc = await Enrollment.create({
      userId,
      courseId,
      enrolledAt: new Date(),
      completedLessons: [],
      progressPercent: 0
    });

    const record: StoredEnrollmentRecord = {
      id: createdDoc._id.toString(),
      userId: createdDoc.userId.toString(),
      courseId: createdDoc.courseId.toString(),
      enrolledAt: createdDoc.enrolledAt,
      completedLessons: [],
      progressPercent: 0,
      lastAccessedLessonId: null,
      completedAt: null,
      createdAt: createdDoc.createdAt,
      updatedAt: createdDoc.updatedAt
    };

    const formatted = await formatEnrichedEnrollment(record);
    return { created: true, enrollment: formatted };
  }

  const key = enrollmentKey(userId, courseId);
  const existing = memoryEnrollments.get(key);
  if (existing) {
    const synced = await recomputeAndSyncEnrollment(userId, courseId);
    const formatted = await formatEnrichedEnrollment(synced!);
    return { created: false, enrollment: formatted };
  }

  const now = new Date();
  const createdRecord: StoredEnrollmentRecord = {
    id: new mongoose.Types.ObjectId().toString(),
    userId,
    courseId,
    enrolledAt: now,
    completedLessons: [],
    progressPercent: 0,
    lastAccessedLessonId: null,
    completedAt: null,
    createdAt: now,
    updatedAt: now
  };
  memoryEnrollments.set(key, createdRecord);

  const formatted = await formatEnrichedEnrollment(createdRecord);
  return { created: true, enrollment: formatted };
}

export async function findEnrichedUserEnrollment(userId: string, courseId: string) {
  if (!isValidObjectId(userId) || !isValidObjectId(courseId)) return null;

  if (isDatabaseConnected()) {
    const doc = await Enrollment.findOne({ userId, courseId }).lean();
    if (!doc) return null;
    return formatEnrichedEnrollment({
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      courseId: doc.courseId.toString(),
      enrolledAt: doc.enrolledAt,
      completedLessons: (doc.completedLessons || []).map((id) => id.toString()),
      progressPercent: doc.progressPercent ?? 0,
      lastAccessedLessonId: doc.lastAccessedLessonId ? doc.lastAccessedLessonId.toString() : null,
      completedAt: doc.completedAt ?? null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });
  }

  const existing = memoryEnrollments.get(enrollmentKey(userId, courseId));
  if (!existing) return null;
  return formatEnrichedEnrollment(existing);
}

export async function listEnrichedUserEnrollments(userId: string) {
  if (!isValidObjectId(userId)) return [];

  if (isDatabaseConnected()) {
    const docs = await Enrollment.find({ userId }).sort({ updatedAt: -1 }).lean();
    const enriched = await Promise.all(
      docs.map((doc) =>
        formatEnrichedEnrollment({
          id: doc._id.toString(),
          userId: doc.userId.toString(),
          courseId: doc.courseId.toString(),
          enrolledAt: doc.enrolledAt,
          completedLessons: (doc.completedLessons || []).map((id) => id.toString()),
          progressPercent: doc.progressPercent ?? 0,
          lastAccessedLessonId: doc.lastAccessedLessonId
            ? doc.lastAccessedLessonId.toString()
            : null,
          completedAt: doc.completedAt ?? null,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt
        })
      )
    );
    return enriched.filter((e) => Boolean(e.course));
  }

  const userRecords = Array.from(memoryEnrollments.values())
    .filter((e) => e.userId === userId)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  const enriched = await Promise.all(userRecords.map((rec) => formatEnrichedEnrollment(rec)));
  return enriched.filter((e) => Boolean(e.course));
}

export async function findUserLessonProgressMapForCourse(
  userId: string,
  courseId: string
): Promise<Map<string, { status: LessonProgressStatus; completedAt: string | null; lastViewedAt: string }>> {
  const result = new Map<
    string,
    { status: LessonProgressStatus; completedAt: string | null; lastViewedAt: string }
  >();
  if (!isValidObjectId(userId) || !isValidObjectId(courseId)) return result;

  if (isDatabaseConnected()) {
    const docs = await LessonProgress.find({ userId, courseId }).lean();
    for (const d of docs) {
      result.set(d.lessonId.toString(), {
        status: d.status,
        completedAt: d.completedAt ? new Date(d.completedAt).toISOString() : null,
        lastViewedAt: new Date(d.lastViewedAt).toISOString()
      });
    }
    return result;
  }

  for (const rec of memoryLessonProgress.values()) {
    if (rec.userId === userId && rec.courseId === courseId) {
      result.set(rec.lessonId, {
        status: rec.status,
        completedAt: rec.completedAt ? rec.completedAt.toISOString() : null,
        lastViewedAt: rec.lastViewedAt.toISOString()
      });
    }
  }
  return result;
}

export async function recordEnrolledLessonView(
  userId: string,
  courseId: string,
  lessonId: string
): Promise<void> {
  const enrolled = await isUserEnrolledInCourse(userId, courseId);
  if (!enrolled) return;

  const now = new Date();

  if (isDatabaseConnected()) {
    const existing = await LessonProgress.findOne({ userId, lessonId });
    if (!existing) {
      await LessonProgress.create({
        userId,
        courseId,
        lessonId,
        status: 'in_progress',
        completedAt: null,
        lastViewedAt: now
      });
    } else {
      existing.lastViewedAt = now;
      await existing.save();
    }
    await Enrollment.updateOne(
      { userId, courseId },
      { $set: { lastAccessedLessonId: new mongoose.Types.ObjectId(lessonId) } }
    );
    return;
  }

  const pKey = progressKey(userId, lessonId);
  const existing = memoryLessonProgress.get(pKey);
  if (!existing) {
    memoryLessonProgress.set(pKey, {
      id: new mongoose.Types.ObjectId().toString(),
      userId,
      courseId,
      lessonId,
      status: 'in_progress',
      completedAt: null,
      lastViewedAt: now,
      createdAt: now,
      updatedAt: now
    });
  } else {
    existing.lastViewedAt = now;
    existing.updatedAt = now;
  }

  const eKey = enrollmentKey(userId, courseId);
  const enrollment = memoryEnrollments.get(eKey);
  if (enrollment) {
    enrollment.lastAccessedLessonId = lessonId;
    enrollment.updatedAt = now;
  }
}

export async function upsertUserLessonProgress(
  userId: string,
  courseId: string,
  lessonId: string,
  status: LessonProgressStatus
) {
  const now = new Date();
  let savedProgress: StoredLessonProgressRecord;

  if (isDatabaseConnected()) {
    const existing = await LessonProgress.findOne({ userId, lessonId }).lean();
    const completedAt =
      status === 'completed'
        ? existing?.completedAt
          ? new Date(existing.completedAt)
          : now
        : null;

    const updated = await LessonProgress.findOneAndUpdate(
      { userId, lessonId },
      {
        $set: {
          courseId,
          status,
          completedAt,
          lastViewedAt: now
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    savedProgress = {
      id: updated!._id.toString(),
      userId: updated!.userId.toString(),
      courseId: updated!.courseId.toString(),
      lessonId: updated!.lessonId.toString(),
      status: updated!.status,
      completedAt: updated!.completedAt ? new Date(updated!.completedAt) : null,
      lastViewedAt: new Date(updated!.lastViewedAt),
      createdAt: new Date(updated!.createdAt),
      updatedAt: new Date(updated!.updatedAt)
    };
  } else {
    const pKey = progressKey(userId, lessonId);
    const existing = memoryLessonProgress.get(pKey);
    const completedAt =
      status === 'completed' ? (existing?.completedAt ? existing.completedAt : now) : null;

    if (existing) {
      existing.status = status;
      existing.completedAt = completedAt;
      existing.lastViewedAt = now;
      existing.updatedAt = now;
      savedProgress = { ...existing };
    } else {
      const created: StoredLessonProgressRecord = {
        id: new mongoose.Types.ObjectId().toString(),
        userId,
        courseId,
        lessonId,
        status,
        completedAt,
        lastViewedAt: now,
        createdAt: now,
        updatedAt: now
      };
      memoryLessonProgress.set(pKey, created);
      savedProgress = { ...created };
    }
  }

  const syncedEnrollment = await recomputeAndSyncEnrollment(userId, courseId, lessonId);
  const formattedCourseProgress = syncedEnrollment
    ? await formatEnrichedEnrollment(syncedEnrollment)
    : null;

  return {
    lessonProgress: {
      id: savedProgress.id,
      userId: savedProgress.userId,
      courseId: savedProgress.courseId,
      lessonId: savedProgress.lessonId,
      status: savedProgress.status,
      completed: savedProgress.status === 'completed',
      completedAt: savedProgress.completedAt ? savedProgress.completedAt.toISOString() : null,
      lastViewedAt: savedProgress.lastViewedAt.toISOString()
    },
    courseProgress: formattedCourseProgress
  };
}

export async function getAuthoritativeUserProgressOverview(
  userId: string,
  filterCourseId?: string
) {
  const allEnrollments = await listEnrichedUserEnrollments(userId);
  const courses = filterCourseId
    ? allEnrollments.filter((e) => e.courseId === filterCourseId)
    : allEnrollments;

  let lessonRecords: Array<{
    lessonId: string;
    courseId: string;
    status: LessonProgressStatus;
    completedAt: string | null;
    lastViewedAt: string;
  }> = [];

  if (isDatabaseConnected() && isValidObjectId(userId)) {
    const query: Record<string, unknown> = { userId };
    if (filterCourseId && isValidObjectId(filterCourseId)) {
      query.courseId = filterCourseId;
    }
    const docs = await LessonProgress.find(query).sort({ lastViewedAt: -1 }).limit(25).lean();
    lessonRecords = docs.map((d) => ({
      lessonId: d.lessonId.toString(),
      courseId: d.courseId.toString(),
      status: d.status,
      completedAt: d.completedAt ? new Date(d.completedAt).toISOString() : null,
      lastViewedAt: new Date(d.lastViewedAt).toISOString()
    }));
  } else {
    lessonRecords = Array.from(memoryLessonProgress.values())
      .filter((r) => r.userId === userId && (!filterCourseId || r.courseId === filterCourseId))
      .sort((a, b) => b.lastViewedAt.getTime() - a.lastViewedAt.getTime())
      .slice(0, 25)
      .map((r) => ({
        lessonId: r.lessonId,
        courseId: r.courseId,
        status: r.status,
        completedAt: r.completedAt ? r.completedAt.toISOString() : null,
        lastViewedAt: r.lastViewedAt.toISOString()
      }));
  }

  const completedCoursesCount = courses.filter((c) => c.status === 'completed').length;
  const inProgressCoursesCount = courses.length - completedCoursesCount;
  const totalCompletedLessons = courses.reduce((sum, c) => sum + c.completedLessonsCount, 0);

  return {
    userId,
    summary: {
      enrolledCoursesCount: courses.length,
      completedCoursesCount,
      inProgressCoursesCount,
      totalCompletedLessons
    },
    courses,
    recentLessons: lessonRecords
  };
}
