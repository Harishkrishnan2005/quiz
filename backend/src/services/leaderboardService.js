import { Leaderboard } from "../models/Leaderboard.js";
import { QuizAttempt } from "../models/QuizAttempt.js";

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

export const recalculateLeaderboardForUser = async (userId, tenantSlug) => {
  const [activeAttemptCandidates, totalAttempts] = await Promise.all([
    QuizAttempt.find({ userId, tenantSlug, isActive: { $ne: false } }).sort({ createdAt: -1 }),
    QuizAttempt.countDocuments({ userId, tenantSlug })
  ]);
  const activeAttempts = pickLatestActiveAttempts(activeAttemptCandidates).sort(
    (left, right) => right.accuracy - left.accuracy || right.createdAt - left.createdAt
  );

  const totalCategoriesAttempted = activeAttempts.length;
  const averageAccuracy = totalCategoriesAttempted
    ? Number(
        (
          activeAttempts.reduce((sum, attempt) => sum + attempt.accuracy, 0) / totalCategoriesAttempted
        ).toFixed(2)
      )
    : 0;
  const bestCategory = activeAttempts[0]?.category || "";

  const leaderboard = await Leaderboard.findOneAndUpdate(
    { userId },
    {
      totalCategoriesAttempted,
      averageAccuracy,
      bestCategory,
      totalAttempts
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return leaderboard;
};

export const getLeaderboardEntries = async () => {
  const leaderboard = await Leaderboard.find()
    .sort({ averageAccuracy: -1, totalCategoriesAttempted: -1, totalAttempts: -1, updatedAt: 1 })
    .populate("userId", "fullName email")
    .limit(20);

  return leaderboard.map((entry, index) => ({
    rank: index + 1,
    username: entry.userId?.fullName || "Unknown",
    averageAccuracy: entry.averageAccuracy,
    totalCategoriesAttempted: entry.totalCategoriesAttempted,
    totalAttempts: entry.totalAttempts,
    bestCategory: entry.bestCategory || "N/A"
  }));
};

export const getLeaderboardRank = async (entry) => {
  if (!entry) return null;

  return (
    await Leaderboard.countDocuments({
      $or: [
        { averageAccuracy: { $gt: entry.averageAccuracy } },
        {
          averageAccuracy: entry.averageAccuracy,
          totalCategoriesAttempted: { $gt: entry.totalCategoriesAttempted }
        },
        {
          averageAccuracy: entry.averageAccuracy,
          totalCategoriesAttempted: entry.totalCategoriesAttempted,
          totalAttempts: { $gt: entry.totalAttempts }
        }
      ]
    })
  ) + 1;
};
