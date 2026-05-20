import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tenantSlug: { type: String, required: true, lowercase: true, trim: true, default: "public" },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true }],
    selectedAnswers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
        answer: { type: String, default: "" }
      }
    ],
    score: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    category: { type: String, required: true },
    attemptNumber: { type: Number, required: true, default: 1 },
    isActive: { type: Boolean, default: true },
    isRetaken: { type: Boolean, default: false },
    supersededBy: { type: mongoose.Schema.Types.ObjectId, ref: "QuizAttempt", default: null }
  },
  { timestamps: true }
);

quizAttemptSchema.index({ userId: 1, tenantSlug: 1, category: 1, createdAt: -1 });
quizAttemptSchema.index({ userId: 1, isActive: 1 });

export const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);
