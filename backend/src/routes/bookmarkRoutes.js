import { Router } from "express";

import { addBookmark, getBookmarks, removeBookmark } from "../controllers/bookmarkController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(protect);
router.post("/", addBookmark);
router.delete("/:questionId", removeBookmark);
router.get("/", getBookmarks);

export default router;
