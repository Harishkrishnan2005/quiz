import { Bookmark } from "../models/Bookmark.js";
import { Question } from "../models/Question.js";
import { QuizAttempt } from "../models/QuizAttempt.js";
import { ApiError } from "../utils/ApiError.js";
import { recalculateLeaderboardForUser } from "./leaderboardService.js";

export const getQuestions = async (filters = {}) => {
  const query = {};
  if (filters.category) query.category = filters.category;
  if (filters.difficulty) query.difficulty = filters.difficulty;
  if (filters.tenantSlug) query.tenantSlug = filters.tenantSlug;

  const limit = Number(filters.limit || 10);
  const questions = await Question.aggregate([{ $match: query }, { $sample: { size: limit } }]);
  return questions;
};

const getLatestCategoryAttempt = (userId, tenantSlug, category) =>
  QuizAttempt.findOne({ userId, tenantSlug, category }).sort({ createdAt: -1 });

const pickLatestActiveAttempts = (attempts) => {
  const seenCategories = new Set();

  return attempts.filter((attempt) => {
    if (seenCategories.has(attempt.category)) {
      return false;
    }

    seenCategories.add(attempt.category);
    return true;
  });
};

const buildAttemptResult = (attempt) => ({
  attemptId: attempt._id,
  score: attempt.score,
  totalQuestions: attempt.questions.length,
  accuracy: attempt.accuracy,
  attemptDate: attempt.createdAt,
  attemptNumber: attempt.attemptNumber || 1
});

export const getAttemptStatus = async (userId, tenantSlug, category) => {
  const latestAttempt = await QuizAttempt.findOne({
    userId,
    tenantSlug,
    category,
    isActive: { $ne: false }
  }).sort({ createdAt: -1 });

  if (!latestAttempt) {
    return { attempted: false };
  }

  return {
    attempted: true,
    latestResult: buildAttemptResult(latestAttempt)
  };
};

export const prepareRetakeQuiz = async (userId, tenantSlug, category, limit = 10) => {
  const latestAttempt = await getLatestCategoryAttempt(userId, tenantSlug, category);
  if (!latestAttempt) {
    throw new ApiError(404, "No previous attempt found for this category");
  }
  const previousAttemptCount = await QuizAttempt.countDocuments({ userId, tenantSlug, category });

  const questions = await getQuestions({ category, limit, tenantSlug });
  if (!questions.length) {
    throw new ApiError(404, "No questions found for this category");
  }

  return {
    questions,
    attemptNumber: Math.max(latestAttempt.attemptNumber || 0, previousAttemptCount) + 1,
    previousResult: buildAttemptResult(latestAttempt)
  };
};

export const submitQuiz = async (userId, tenantSlug, { category, answers }) => {
  const questionIds = answers.map((answer) => answer.questionId);
  const questions = await Question.find({ _id: { $in: questionIds }, tenantSlug, category });
  if (!questions.length) throw new ApiError(404, "No questions found for submission");
  if (questions.length !== questionIds.length) {
    throw new ApiError(400, "Quiz submission contained questions outside the selected category");
  }

  const previousAttempts = await QuizAttempt.find({ userId, tenantSlug, category }).sort({ createdAt: -1 });
  const attemptNumber = previousAttempts.length
    ? Math.max(...previousAttempts.map((attempt) => attempt.attemptNumber || 0), previousAttempts.length) + 1
    : 1;

  let score = 0;
  const selectedAnswers = answers.map((answer) => {
    const question = questions.find((item) => item.id === answer.questionId);
    if (question && question.correctAnswer === answer.answer) score += 1;
    return answer;
  });

  const accuracy = Number(((score / questions.length) * 100).toFixed(2));
  const attempt = await QuizAttempt.create({
    userId,
    tenantSlug,
    questions: questionIds,
    selectedAnswers,
    score,
    accuracy,
    category,
    attemptNumber,
    isActive: true
  });

  if (previousAttempts.length) {
    await QuizAttempt.updateMany(
      { userId, tenantSlug, category, _id: { $ne: attempt._id }, isActive: { $ne: false } },
      { $set: { isActive: false, isRetaken: true, supersededBy: attempt._id } }
    );
  }

  await recalculateLeaderboardForUser(userId, tenantSlug);

  return attempt;
};

export const getQuizAttemptById = async (attemptId) => {
  const attempt = await QuizAttempt.findById(attemptId)
    .populate("questions")
    .populate("selectedAnswers.questionId");
  if (!attempt) throw new ApiError(404, "Attempt not found");
  return attempt;
};

export const getTenantQuizAttemptById = async (attemptId, tenantSlug, userId = null) => {
  const query = { _id: attemptId, tenantSlug };
  if (userId) query.userId = userId;

  const attempt = await QuizAttempt.findOne(query).populate("questions").populate("selectedAnswers.questionId");
  if (!attempt) throw new ApiError(404, "Attempt not found");
  return attempt;
};

export const getUserPerformance = async (userId, tenantSlug) => {
  const [attempts, activeAttemptCandidates] = await Promise.all([
    QuizAttempt.find({ userId, tenantSlug })
      .sort({ createdAt: -1 })
      .populate("questions"),
    QuizAttempt.find({ userId, tenantSlug, isActive: { $ne: false } })
      .sort({ createdAt: -1 })
      .populate("questions")
  ]);
  const activeAttempts = pickLatestActiveAttempts(activeAttemptCandidates);
  const bookmarksCount = await Bookmark.countDocuments({ userId, tenantSlug });

  const totalAttempts = attempts.length;
  const activeAttemptCount = activeAttempts.length;
  const totalScore = activeAttempts.reduce((sum, item) => sum + item.score, 0);
  const averageScore = activeAttemptCount ? Number((totalScore / activeAttemptCount).toFixed(2)) : 0;
  const bestScore = activeAttemptCount ? Math.max(...activeAttempts.map((item) => item.score)) : 0;

  const topicMap = activeAttempts.reduce((acc, item) => {
    acc[item.category] = item.accuracy;
    return acc;
  }, {});

  const weakTopics = Object.entries(topicMap)
    .map(([topic, accuracy]) => ({
      topic,
      accuracy
    }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 4);

  const categorySummaries = activeAttempts
    .map((attempt) => ({
      category: attempt.category,
      latestScore: attempt.score,
      totalQuestions: attempt.questions?.length || 0,
      accuracy: attempt.accuracy,
      totalAttempts: attempts.filter((item) => item.category === attempt.category).length,
      lastAttemptDate: attempt.createdAt,
      attemptId: attempt._id
    }))
    .sort((a, b) => new Date(b.lastAttemptDate) - new Date(a.lastAttemptDate));

  return {
    totalQuizzesAttempted: totalAttempts,
    averageScore,
    bestScore,
    bookmarkedCount: bookmarksCount,
    weakTopics,
    recentAttempts: attempts.slice(0, 5),
    categorySummaries
  };
};
