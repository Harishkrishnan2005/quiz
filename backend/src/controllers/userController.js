import { Bookmark } from "../models/Bookmark.js";
import { Leaderboard } from "../models/Leaderboard.js";
import { QuizAttempt } from "../models/QuizAttempt.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getSanitizedUser, updateUserProfile } from "../services/authService.js";
import { getUserPerformance } from "../services/quizService.js";
import { getLeaderboardRank } from "../services/leaderboardService.js";

export const getUserProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, user: getSanitizedUser(req.user) });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await updateUserProfile(req.user.id, req.body);
  res.json({ success: true, user });
});

export const getPerformance = asyncHandler(async (req, res) => {
  const performance = await getUserPerformance(req.user.id, req.user.tenantSlug);
  res.json({ success: true, performance });
});

export const getHistory = asyncHandler(async (req, res) => {
  const history = await QuizAttempt.find({ userId: req.user.id, tenantSlug: req.user.tenantSlug })
    .sort({ createdAt: -1 })
    .populate("questions");
  res.json({ success: true, history });
});

export const getDashboard = asyncHandler(async (req, res) => {
  const [performance, leaderboard, bookmarkCount] = await Promise.all([
    getUserPerformance(req.user.id, req.user.tenantSlug),
    Leaderboard.findOne({ userId: req.user.id }),
    Bookmark.countDocuments({ userId: req.user.id, tenantSlug: req.user.tenantSlug })
  ]);

  res.json({
    success: true,
    dashboard: {
      ...performance,
      leaderboardRank: await getLeaderboardRank(leaderboard),
      bookmarkCount
    }
  });
});
