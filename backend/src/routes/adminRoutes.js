import { Router } from "express";

import {
  blockUser,
  createQuestion,
  deleteQuestion,
  generateQuestionsWithAi,
  getAnalytics,
  getGeneratedQuestions,
  getQuestionsAdmin,
  importQuestionsFromPdf,
  getUsers,
  saveGeneratedQuestionsController,
  unblockUser,
  updateQuestion,
  uploadSource
} from "../controllers/adminController.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { questionValidator } from "../validators/questionValidators.js";

const router = Router();

router.use(protect, authorize("admin"));
router.get("/users", getUsers);
router.patch("/users/:id/block", blockUser);
router.patch("/users/:id/unblock", unblockUser);
router.get("/questions", getQuestionsAdmin);
router.post("/questions", questionValidator, validateRequest, createQuestion);
router.post("/questions/import-mcq", upload.single("file"), importQuestionsFromPdf);
router.put("/questions/:id", questionValidator, validateRequest, updateQuestion);
router.delete("/questions/:id", deleteQuestion);
router.post("/ai/upload", upload.single("file"), uploadSource);
router.post("/ai/generate-mcq", upload.single("file"), generateQuestionsWithAi);
router.get("/generated-questions", getGeneratedQuestions);
router.post("/generated-questions/save", saveGeneratedQuestionsController);
router.get("/analytics", getAnalytics);

export default router;
