import mongoose from "mongoose";

const generatedQuestionSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tenantSlug: { type: String, required: true, lowercase: true, trim: true, default: "public" },
    sourceText: { type: String, required: true },
    generatedQuestions: [
      {
        questionText: { type: String, required: true },
        options: { type: [String], required: true },
        correctAnswer: { type: String, required: true },
        explanation: { type: String, default: "" },
        category: { type: String, required: true },
        difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" }
      }
    ]
  },
  { timestamps: true }
);

export const GeneratedQuestion = mongoose.model("GeneratedQuestion", generatedQuestionSchema);
