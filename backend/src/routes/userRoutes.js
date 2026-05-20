import { Router } from "express";

import { getDashboard, getHistory, getPerformance, getUserProfile, updateUser } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { profileValidator } from "../validators/authValidators.js";

const router = Router();

router.use(protect);
router.get("/profile", getUserProfile);
router.put("/profile", profileValidator, validateRequest, updateUser);
router.get("/dashboard", getDashboard);
router.get("/performance", getPerformance);
router.get("/history", getHistory);

export default router;
