import { asyncHandler } from "../utils/asyncHandler.js";
import { getSanitizedUser, loginUser, registerUser, updateUserProfile } from "../services/authService.js";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: false,
  maxAge: 7 * 24 * 60 * 60 * 1000
};

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  res.cookie("token", result.token, cookieOptions);
  res.status(201).json({ success: true, ...result });
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  res.cookie("token", result.token, cookieOptions);
  res.json({ success: true, ...result });
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
});

export const getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, user: getSanitizedUser(req.user) });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await updateUserProfile(req.user.id, req.body);
  res.json({ success: true, user });
});
