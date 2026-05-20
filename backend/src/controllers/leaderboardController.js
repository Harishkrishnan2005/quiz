import { asyncHandler } from "../utils/asyncHandler.js";
import { getLeaderboardEntries } from "../services/leaderboardService.js";

export const getLeaderboard = asyncHandler(async (_req, res) => {
  const leaderboard = await getLeaderboardEntries();
  res.json({ success: true, leaderboard });
});
