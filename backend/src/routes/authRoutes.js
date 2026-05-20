import { Router } from "express";

import { getProfile, login, logout, register, updateProfile } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { loginValidator, profileValidator, registerValidator } from "../validators/authValidators.js";

const router = Router();

router.post("/register", registerValidator, validateRequest, register);
router.post("/login", loginValidator, validateRequest, login);
router.post("/logout", logout);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, profileValidator, validateRequest, updateProfile);

export default router;
