import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { verifyToken } from "../utils/token.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const extractToken = (req) => {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.replace("Bearer ", "");
  return req.cookies?.token || null;
};

export const protect = asyncHandler(async (req, _res, next) => {
  const token = extractToken(req);
  if (!token) throw new ApiError(401, "Authentication required");

  const decoded = verifyToken(token);
  const user = await User.findById(decoded.id);

  if (!user) throw new ApiError(401, "User not found");
  if (user.isBlocked) throw new ApiError(403, "This account is blocked");

  req.user = user;
  next();
});

export const authorize = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, "You do not have access to this resource"));
  }
  next();
};
