import { body } from "express-validator";

export const questionValidator = [
  body("questionText").trim().notEmpty().withMessage("Question text is required"),
  body("options").isArray({ min: 4, max: 4 }).withMessage("Exactly 4 options are required"),
  body("correctAnswer").trim().notEmpty().withMessage("Correct answer is required"),
  body("topicTitle").optional().isString(),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("difficulty").isIn(["easy", "medium", "hard"]).withMessage("Invalid difficulty")
];
