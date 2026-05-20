import { Router } from "express";

import {
  getAllQuestions,
  getQuestionsByCategory,
  getQuizAttemptStatus,
  getScore,
  retryQuiz,
  submitQuizAnswers
} from "../controllers/quizController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { categoryParamValidator, questionQueryValidator, submitQuizValidator } from "../validators/quizValidators.js";

const router = Router();

router.get("/questions", protect, questionQueryValidator, validateRequest, getAllQuestions);
router.get("/questions/:category", protect, categoryParamValidator, validateRequest, getQuestionsByCategory);
router.get("/attempt-status/:category", protect, categoryParamValidator, validateRequest, getQuizAttemptStatus);
router.post("/submit", protect, submitQuizValidator, validateRequest, submitQuizAnswers);
router.get("/score/:attemptId", protect, getScore);
router.post("/retake/:category", protect, categoryParamValidator, validateRequest, retryQuiz);

export default router;
