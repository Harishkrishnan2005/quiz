import { body, param, query } from "express-validator";

export const categoryParamValidator = [
  param("category").trim().notEmpty().withMessage("Category is required")
];

export const questionQueryValidator = [
  query("category").optional().isString(),
  query("difficulty").optional().isIn(["easy", "medium", "hard"]),
  query("limit").optional().isInt({ min: 1, max: 25 })
];

export const submitQuizValidator = [
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("answers").isArray({ min: 1 }).withMessage("Answers are required"),
  body("retryOfAttemptId").optional({ values: "null" }).isString()
];
