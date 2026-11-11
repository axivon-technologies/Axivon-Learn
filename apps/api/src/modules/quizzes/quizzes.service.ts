import { AppError } from '../../middleware/errorHandler';
import { AuthenticatedUser } from '../../middleware/authenticate';
import { isUserEnrolledInCourse } from '../enrollments/learner.store';
import {
  listPublishedQuizzesForCourse,
  findPublicQuizWithoutAnswerKey,
  findPublishedQuizForServerGrading,
  countUserAttemptsForQuiz,
  createQuizAttemptRecord,
  listQuizAttemptsForUser
} from './quizzes.store';
import { SubmitQuizAttemptInput } from './quizzes.validators';

export const MAX_ATTEMPTS_PER_QUIZ = 5;

export async function getCourseQuizzesList(courseId: string) {
  const quizzes = await listPublishedQuizzesForCourse(courseId);
  if (!quizzes) {
    throw new AppError('Published course not found.', 404, undefined, 'NOT_FOUND');
  }
  return quizzes;
}

export async function getQuizPayloadForLearner(quizId: string) {
  const quiz = await findPublicQuizWithoutAnswerKey(quizId);
  if (!quiz) {
    throw new AppError('Quiz not found.', 404, undefined, 'NOT_FOUND');
  }
  return quiz;
}

function normalizeAnswersToMap(input: SubmitQuizAttemptInput['answers']): Record<string, number> {
  if (Array.isArray(input)) {
    const map: Record<string, number> = {};
    for (const item of input) {
      if (Object.prototype.hasOwnProperty.call(map, item.questionId)) {
        throw new AppError(
          `Duplicate answer submitted for question '${item.questionId}'.`,
          400,
          undefined,
          'VALIDATION_ERROR'
        );
      }
      map[item.questionId] = item.selectedOptionIndex;
    }
    return map;
  }
  return input;
}

export async function submitQuizAttemptAndScore(
  actor: AuthenticatedUser,
  quizId: string,
  payload: SubmitQuizAttemptInput
) {
  const quiz = await findPublishedQuizForServerGrading(quizId);
  if (!quiz) {
    throw new AppError('Quiz not found.', 404, undefined, 'NOT_FOUND');
  }

  // Enforce enrollment (admin can also test-grade quizzes)
  if (actor.role !== 'admin') {
    const enrolled = await isUserEnrolledInCourse(actor.id, quiz.courseId);
    if (!enrolled) {
      throw new AppError(
        'Course enrollment is required before submitting quiz attempts.',
        403,
        undefined,
        'FORBIDDEN'
      );
    }
  }

  // Enforce attempt cap policy per learner per quiz
  const previousAttempts = await countUserAttemptsForQuiz(actor.id, quiz.id);
  if (previousAttempts >= MAX_ATTEMPTS_PER_QUIZ) {
    throw new AppError(
      `Maximum quiz attempt limit (${MAX_ATTEMPTS_PER_QUIZ}) reached for this assessment.`,
      409,
      undefined,
      'ATTEMPT_LIMIT_REACHED'
    );
  }

  const normalizedAnswers = normalizeAnswersToMap(payload.answers);
  const submittedKeys = Object.keys(normalizedAnswers);

  if (quiz.questions.length === 0) {
    throw new AppError('Quiz has no configured questions.', 400, undefined, 'VALIDATION_ERROR');
  }

  if (submittedKeys.length === 0) {
    throw new AppError(
      'Please submit answers for all quiz questions.',
      400,
      undefined,
      'VALIDATION_ERROR'
    );
  }

  const questionById = new Map(quiz.questions.map((q) => [q.id, q]));

  // Validate no unknown questionIds and every option index is within bounds
  for (const [questionId, selectedIndex] of Object.entries(normalizedAnswers)) {
    const question = questionById.get(questionId);
    if (!question) {
      throw new AppError(
        `Submitted questionId '${questionId}' does not belong to this quiz.`,
        400,
        undefined,
        'VALIDATION_ERROR'
      );
    }
    if (
      !Number.isInteger(selectedIndex) ||
      selectedIndex < 0 ||
      selectedIndex >= question.options.length
    ) {
      throw new AppError(
        `Selected option index ${selectedIndex} is out of range for question '${questionId}'.`,
        400,
        undefined,
        'VALIDATION_ERROR'
      );
    }
  }

  // Require all quiz questions to be answered in a complete attempt
  for (const q of quiz.questions) {
    if (!Object.prototype.hasOwnProperty.call(normalizedAnswers, q.id)) {
      throw new AppError(
        'All quiz questions must be answered before submitting.',
        400,
        undefined,
        'VALIDATION_ERROR'
      );
    }
  }

  // Authoritative server-side scoring (any client-supplied score/passed fields are ignored)
  let score = 0;
  const feedback = quiz.questions.map((q) => {
    const selectedOptionIndex = normalizedAnswers[q.id];
    const isCorrect = selectedOptionIndex === q.correctOptionIndex;
    if (isCorrect) score += 1;
    return {
      questionId: q.id,
      selectedOptionIndex,
      isCorrect,
      explanation: q.explanation
    };
  });

  const totalQuestions = quiz.questions.length;
  const passed = score >= quiz.passingScore;
  const percentage = Math.round((score / totalQuestions) * 100);

  const savedAttempt = await createQuizAttemptRecord({
    userId: actor.id,
    quizId: quiz.id,
    answers: normalizedAnswers,
    score,
    totalQuestions,
    passed
  });

  const attemptNumber = previousAttempts + 1;

  return {
    attemptId: savedAttempt.id,
    quizId: quiz.id,
    courseId: quiz.courseId,
    score,
    total: totalQuestions,
    totalQuestions,
    maxScore: totalQuestions,
    passingScore: quiz.passingScore,
    percentage,
    passed,
    attemptNumber,
    maxAttempts: MAX_ATTEMPTS_PER_QUIZ,
    remainingAttempts: Math.max(0, MAX_ATTEMPTS_PER_QUIZ - attemptNumber),
    attemptedAt: savedAttempt.attemptedAt,
    feedback
  };
}

export async function getLearnerOwnQuizAttempts(userId: string) {
  return listQuizAttemptsForUser(userId);
}
