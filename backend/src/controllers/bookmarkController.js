import { Bookmark } from "../models/Bookmark.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addBookmark = asyncHandler(async (req, res) => {
  const bookmark = await Bookmark.findOneAndUpdate(
    { userId: req.user.id, tenantSlug: req.user.tenantSlug, questionId: req.body.questionId },
    { userId: req.user.id, tenantSlug: req.user.tenantSlug, questionId: req.body.questionId },
    { upsert: true, new: true }
  ).populate("questionId");

  res.status(201).json({ success: true, bookmark });
});

export const removeBookmark = asyncHandler(async (req, res) => {
  await Bookmark.findOneAndDelete({ userId: req.user.id, tenantSlug: req.user.tenantSlug, questionId: req.params.questionId });
  res.json({ success: true, message: "Bookmark removed" });
});

export const getBookmarks = asyncHandler(async (req, res) => {
  const bookmarks = await Bookmark.find({ userId: req.user.id, tenantSlug: req.user.tenantSlug }).populate("questionId");
  res.json({ success: true, bookmarks });
});
