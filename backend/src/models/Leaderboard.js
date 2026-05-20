import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    totalCategoriesAttempted: { type: Number, default: 0 },
    averageAccuracy: { type: Number, default: 0 },
    bestCategory: { type: String, default: "" },
    totalAttempts: { type: Number, default: 0 }
  },
  { timestamps: true }
);

leaderboardSchema.index({ averageAccuracy: -1, totalCategoriesAttempted: -1, totalAttempts: -1 });

export const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);
