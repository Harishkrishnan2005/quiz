import { Question } from "../models/Question.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { extractTextFromFile, generateMcqs, getAdminAnalytics, importMcqsFromDocument, saveGeneratedQuestions } from "../services/adminService.js";
import { GeneratedQuestion } from "../models/GeneratedQuestion.js";

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ tenantSlug: req.user.tenantSlug }).sort({ createdAt: -1 });
  res.json({ success: true, users });
});

export const blockUser = asyncHandler(async (req, res) => {
  const user = await User.findOneAndUpdate(
    { _id: req.params.id, tenantSlug: req.user.tenantSlug },
    { isBlocked: true },
    { new: true }
  );
  if (!user) throw new ApiError(404, "User not found");
  res.json({ success: true, user });
});

export const unblockUser = asyncHandler(async (req, res) => {
  const user = await User.findOneAndUpdate(
    { _id: req.params.id, tenantSlug: req.user.tenantSlug },
    { isBlocked: false },
    { new: true }
  );
  if (!user) throw new ApiError(404, "User not found");
  res.json({ success: true, user });
});

export const getQuestionsAdmin = asyncHandler(async (req, res) => {
  const filter = { tenantSlug: req.user.tenantSlug };
  if (req.query.category) filter.category = req.query.category;
  const questions = await Question.find(filter).sort({ createdAt: -1 }).populate("createdBy", "fullName");
  res.json({ success: true, questions });
});

export const createQuestion = asyncHandler(async (req, res) => {
  const question = await Question.create({ ...req.body, tenantSlug: req.user.tenantSlug, createdBy: req.user.id });
  res.status(201).json({ success: true, question });
});

export const updateQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findOneAndUpdate(
    { _id: req.params.id, tenantSlug: req.user.tenantSlug },
    { ...req.body, tenantSlug: req.user.tenantSlug },
    { new: true }
  );
  if (!question) throw new ApiError(404, "Question not found");
  res.json({ success: true, question });
});

export const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findOneAndDelete({ _id: req.params.id, tenantSlug: req.user.tenantSlug });
  if (!question) throw new ApiError(404, "Question not found");
  res.json({ success: true, message: "Question deleted" });
});

export const uploadSource = asyncHandler(async (req, res) => {
  const sourceText = req.file ? await extractTextFromFile(req.file) : req.body.sourceText;
  res.json({ success: true, sourceText });
});

export const generateQuestionsWithAi = asyncHandler(async (req, res) => {
  const sourceText = req.file ? await extractTextFromFile(req.file) : req.body.sourceText;
  const generated = await generateMcqs({
    adminId: req.user.id,
    tenantSlug: req.user.tenantSlug,
    sourceText,
    category: req.body.category || "Technical"
  });
  res.status(201).json({ success: true, generated });
});

export const importQuestionsFromPdf = asyncHandler(async (req, res) => {
  const savedQuestions = await importMcqsFromDocument({
    adminId: req.user.id,
    tenantSlug: req.user.tenantSlug,
    file: req.file,
    sourceText: req.body.sourceText,
    category: req.body.category,
    topicTitle: req.body.topicTitle || "",
    difficulty: req.body.difficulty || "medium"
  });

  res.status(201).json({ success: true, savedQuestions });
});

export const getGeneratedQuestions = asyncHandler(async (req, res) => {
  const generatedQuestions = await GeneratedQuestion.find({
    adminId: req.user.id,
    tenantSlug: req.user.tenantSlug
  }).sort({ createdAt: -1 });
  res.json({ success: true, generatedQuestions });
});

export const saveGeneratedQuestionsController = asyncHandler(async (req, res) => {
  const savedQuestions = await saveGeneratedQuestions(req.body.generatedId, req.user.id, req.user.tenantSlug);
  res.status(201).json({ success: true, savedQuestions });
});

export const getAnalytics = asyncHandler(async (req, res) => {
  const analytics = await getAdminAnalytics(req.user.tenantSlug);
  res.json({ success: true, analytics });
});
