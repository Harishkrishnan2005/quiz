import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { signToken } from "../utils/token.js";

const DEFAULT_TENANT = "public";

const sanitizeUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  profileImage: user.profileImage,
  isBlocked: user.isBlocked,
  createdAt: user.createdAt
});

export const registerUser = async (payload) => {
  const tenantSlug = DEFAULT_TENANT;
  const existingUser = await User.findOne({ email: payload.email, tenantSlug });
  if (existingUser) throw new ApiError(409, "Email is already registered");

  const user = await User.create({
    fullName: payload.fullName,
    tenantSlug,
    email: payload.email,
    password: payload.password,
    role: payload.role || "user"
  });

  return {
    token: signToken({ id: user._id, role: user.role }),
    user: sanitizeUser(user)
  };
};

export const loginUser = async ({ email, password }) => {
  let user = await User.findOne({ email, tenantSlug: DEFAULT_TENANT }).select("+password");

  // Smooth over older pre-tenant records when the user is logging into the default workspace.
  if (!user) {
    const legacyUser = await User.findOne({
      email,
      $or: [{ tenantSlug: { $exists: false } }, { tenantSlug: null }, { tenantSlug: "" }]
    }).select("+password");

    if (legacyUser) {
      legacyUser.tenantSlug = DEFAULT_TENANT;
      await legacyUser.save();
      user = legacyUser;
    }
  }

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }
  if (user.isBlocked) throw new ApiError(403, "This account is blocked");

  return {
    token: signToken({ id: user._id, role: user.role }),
    user: sanitizeUser(user)
  };
};

export const updateUserProfile = async (userId, payload) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  if (payload.fullName) user.fullName = payload.fullName;
  if (payload.profileImage !== undefined) user.profileImage = payload.profileImage;
  await user.save();

  return sanitizeUser(user);
};

export const getSanitizedUser = sanitizeUser;
