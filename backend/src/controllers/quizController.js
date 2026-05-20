import { asyncHandler } from "../utils/asyncHandler.js";
import {
  getAttemptStatus,
  getQuestions,
  getTenantQuizAttemptById,
  prepareRetakeQuiz,
  submitQuiz
} from "../services/quizService.js";

export const getAllQuestions = asyncHandler(async (req, res) => {
  const questions = await getQuestions({ ...req.query, tenantSlug: req.user.tenantSlug });
  res.json({ success: true, questions });
});

export const getQuestionsByCategory = asyncHandler(async (req, res) => {
  const questions = await getQuestions({
    category: req.params.category,
    limit: req.query.limit || 10,
    tenantSlug: req.user.tenantSlug
  });
  res.json({ success: true, questions });
});

export const submitQuizAnswers = asyncHandler(async (req, res) => {
  const attempt = await submitQuiz(req.user.id, req.user.tenantSlug, {
    category: req.body.category,
    answers: req.body.answers
  });
  res.status(201).json({ success: true, attempt });
});

export const getQuizAttemptStatus = asyncHandler(async (req, res) => {
  const status = await getAttemptStatus(req.user.id, req.user.tenantSlug, req.params.category);
  res.json({ success: true, ...status });
});

export const getScore = asyncHandler(async (req, res) => {
  const attempt = await getTenantQuizAttemptById(req.params.attemptId, req.user.tenantSlug, req.user.id);
  res.json({ success: true, attempt });
});

export const retryQuiz = asyncHandler(async (req, res) => {
  const { questions, attemptNumber, previousResult } = await prepareRetakeQuiz(
    req.user.id,
    req.user.tenantSlug,
    req.params.category,
    req.query.limit || 10
  );
  res.json({ success: true, questions, attemptNumber, previousResult });
});
