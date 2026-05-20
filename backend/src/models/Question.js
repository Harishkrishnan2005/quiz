import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true, trim: true },
    options: {
      type: [String],
      validate: [(value) => value.length === 4, "Each question must include 4 options"],
      required: true
    },
    correctAnswer: { type: String, required: true },
    explanation: { type: String, default: "" },
    topicTitle: { type: String, default: "", trim: true },
    category: { type: String, required: true, trim: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    tenantSlug: { type: String, required: true, lowercase: true, trim: true, default: "public" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export const Question = mongoose.model("Question", questionSchema);
