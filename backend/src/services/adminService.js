import fs from "fs/promises";

import mammoth from "mammoth";
import OpenAI from "openai";
import pdf from "pdf-parse";

import { env } from "../config/env.js";
import { GeneratedQuestion } from "../models/GeneratedQuestion.js";
import { Question } from "../models/Question.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

const openai = env.openAiApiKey ? new OpenAI({ apiKey: env.openAiApiKey }) : null;

const buildPrompt = (sourceText, category = "Technical") => `
Generate 5 multiple-choice questions from the content below as valid JSON.
Each object must include: questionText, options (exactly 4 strings), correctAnswer, explanation, category, difficulty.
Use category "${category}" unless the content clearly implies a better one.

Content:
${sourceText}
`;

const fallbackQuestionSet = (sourceText, category = "Technical") => [
  {
    questionText: `Which statement best reflects the uploaded material about ${category}?`,
    options: [
      "It introduces a core concept and its practical use",
      "It only lists unrelated facts",
      "It focuses exclusively on company policy",
      "It contains no technical content"
    ],
    correctAnswer: "It introduces a core concept and its practical use",
    explanation: "The fallback generator frames a comprehension check around the supplied source.",
    category,
    difficulty: "medium"
  },
  {
    questionText: "What is the best first step when reviewing a new technical topic?",
    options: ["Ignore definitions", "Identify the key concepts", "Memorize answers only", "Skip examples"],
    correctAnswer: "Identify the key concepts",
    explanation: "Strong assessments usually start from key ideas and vocabulary.",
    category,
    difficulty: "easy"
  },
  {
    questionText: `What is a likely outcome of understanding the material summarized in the upload?`,
    options: ["Better conceptual clarity", "No change at all", "Guaranteed interview offer", "Automatic deployment"],
    correctAnswer: "Better conceptual clarity",
    explanation: "Learning material is intended to improve understanding.",
    category,
    difficulty: "easy"
  },
  {
    questionText: `Which practice would most improve retention of the uploaded ${category} content?`,
    options: ["Writing and reviewing MCQs", "Avoiding self-testing", "Reading without notes", "Skipping revision"],
    correctAnswer: "Writing and reviewing MCQs",
    explanation: "Question-driven recall helps reinforce the topic.",
    category,
    difficulty: "medium"
  },
  {
    questionText: "Why should explanations be stored with quiz questions?",
    options: ["To help learners review mistakes", "To slow the app down", "To replace authentication", "To disable analytics"],
    correctAnswer: "To help learners review mistakes",
    explanation: "Explanations turn quizzes into a learning loop, not just a score.",
    category,
    difficulty: "easy"
  }
];

export const extractTextFromFile = async (file) => {
  if (!file) throw new ApiError(400, "Upload a file or send sourceText directly");

  const buffer = await fs.readFile(file.path);

  if (file.mimetype === "application/pdf") {
    const result = await pdf(buffer);
    return result.text;
  }

  if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  return buffer.toString("utf8");
};

const normalizeOptionValue = (value = "") => value.replace(/\s+/g, " ").trim();

const resolveCorrectAnswer = (rawAnswer, options) => {
  const normalizedAnswer = normalizeOptionValue(rawAnswer);
  const optionIndexes = { A: 0, B: 1, C: 2, D: 3 };
  const letter = normalizedAnswer.toUpperCase().match(/^[A-D]$/)?.[0];

  if (letter) {
    return options[optionIndexes[letter]];
  }

  const answerWithoutLabel = normalizedAnswer.replace(/^[A-D][).:\-\s]+/i, "").trim();
  return options.find((option) => normalizeOptionValue(option).toLowerCase() === answerWithoutLabel.toLowerCase()) || options[0];
};

const parseMcqBlocks = (sourceText, { category, topicTitle, difficulty }) => {
  const normalizedText = sourceText
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n");

  const blocks = normalizedText
    .split(/(?=(?:^|\n)\s*(?:Q(?:uestion)?\s*)?\d+\s*[\).:-])/g)
    .map((block) => block.trim())
    .filter(Boolean);

  const parsedQuestions = [];

  for (const block of blocks) {
    const questionMatch = block.match(/^(?:Q(?:uestion)?\s*)?\d+\s*[\).:-]\s*([\s\S]*?)(?=\n\s*[A-D][).:-]\s+)/i);
    const optionMatches = [...block.matchAll(/(?:^|\n)\s*([A-D])[).:-]\s+([^\n]+)/g)];
    const answerMatch = block.match(/(?:^|\n)\s*Answer\s*[:\-]\s*([^\n]+)/i);
    const explanationMatch = block.match(/(?:^|\n)\s*Explanation\s*[:\-]\s*([\s\S]+)$/i);

    if (!questionMatch || optionMatches.length !== 4 || !answerMatch) {
      continue;
    }

    const options = optionMatches.map((match) => normalizeOptionValue(match[2]));
    const questionText = normalizeOptionValue(questionMatch[1]);

    if (!questionText || options.some((option) => !option)) {
      continue;
    }

    parsedQuestions.push({
      questionText,
      options,
      correctAnswer: resolveCorrectAnswer(answerMatch[1], options),
      explanation: normalizeOptionValue(explanationMatch?.[1] || "Imported from admin document."),
      topicTitle: normalizeOptionValue(topicTitle),
      category,
      difficulty
    });
  }

  return parsedQuestions;
};

export const generateMcqs = async ({ adminId, tenantSlug, sourceText, category }) => {
  const normalizedText = sourceText.trim().replace(/\s+/g, " ");
  const words = normalizedText.split(" ");
  if (words.length > 1000) throw new ApiError(400, "Source text must be 1000 words or fewer");

  let generatedQuestions = fallbackQuestionSet(normalizedText, category);

  if (openai) {
    const response = await openai.responses.create({
      model: env.openAiModel,
      input: buildPrompt(normalizedText, category)
    });

    const content = response.output_text?.trim();
    if (content) {
      try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length) {
          generatedQuestions = parsed;
        }
      } catch {
        generatedQuestions = fallbackQuestionSet(normalizedText, category);
      }
    }
  }

  return GeneratedQuestion.create({
    adminId,
    tenantSlug,
    sourceText: normalizedText,
    generatedQuestions
  });
};

export const saveGeneratedQuestions = async (generatedId, adminId, tenantSlug) => {
  const generatedSet = await GeneratedQuestion.findOne({ _id: generatedId, adminId, tenantSlug });
  if (!generatedSet) throw new ApiError(404, "Generated question set not found");

  const questions = generatedSet.generatedQuestions.map((item) => ({
    ...item,
    tenantSlug,
    createdBy: adminId
  }));

  return Question.insertMany(questions);
};

export const importMcqsFromDocument = async ({
  adminId,
  tenantSlug,
  file,
  sourceText,
  category,
  topicTitle,
  difficulty = "medium"
}) => {
  const extractedText = file ? await extractTextFromFile(file) : sourceText;

  if (!extractedText?.trim()) {
    throw new ApiError(400, "The uploaded document did not contain readable text");
  }

  const parsedQuestions = parseMcqBlocks(extractedText, { category, topicTitle, difficulty });
  if (!parsedQuestions.length) {
    throw new ApiError(400, "No valid MCQs were found. Use numbered questions, A-D options, and an Answer line.");
  }

  return Question.insertMany(
    parsedQuestions.map((question) => ({
      ...question,
      tenantSlug,
      createdBy: adminId
    }))
  );
};

export const getAdminAnalytics = async (tenantSlug) => {
  const [users, questions, generatedSets] = await Promise.all([
    User.countDocuments({ tenantSlug }),
    Question.countDocuments({ tenantSlug }),
    GeneratedQuestion.countDocuments({ tenantSlug })
  ]);

  return { users, questions, generatedSets };
};
