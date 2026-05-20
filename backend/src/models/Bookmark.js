import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tenantSlug: { type: String, required: true, lowercase: true, trim: true, default: "public" },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true }
  },
  { timestamps: true }
);

bookmarkSchema.index({ userId: 1, tenantSlug: 1, questionId: 1 }, { unique: true });

export const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
