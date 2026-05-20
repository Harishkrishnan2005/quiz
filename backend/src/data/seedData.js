import { Question } from "../models/Question.js";
import { User } from "../models/User.js";
import { sampleQuestions } from "../utils/sampleData.js";

export const seedInitialData = async () => {
  const publicAdmin = await User.findOne({ email: "admin@skillforge.dev", tenantSlug: "public" });

  if (!publicAdmin) {
    const legacyAdmin = await User.findOne({ email: "admin@skillforge.dev" });

    if (legacyAdmin) {
      legacyAdmin.tenantSlug = legacyAdmin.tenantSlug || "public";
      legacyAdmin.role = legacyAdmin.role || "admin";
      await legacyAdmin.save();
    } else {
      await User.create({
        fullName: "SkillForge Admin",
        tenantSlug: "public",
        email: "admin@skillforge.dev",
        password: "Admin1234",
        role: "admin"
      });
    }
  }

  const admin = await User.findOne({ email: "admin@skillforge.dev", tenantSlug: "public" });
  if (!admin) {
    await User.create({
      fullName: "SkillForge Admin",
      tenantSlug: "public",
      email: "admin@skillforge.dev",
      password: "Admin1234",
      role: "admin"
    });
  }

  if (sampleQuestions.length) {
    await Question.bulkWrite(
      sampleQuestions.map((question) => ({
        updateOne: {
          filter: {
            tenantSlug: "public",
            category: question.category,
            questionText: question.questionText
          },
          update: {
            $set: {
              ...question,
              tenantSlug: "public",
              createdBy: admin?._id
            }
          },
          upsert: true
        }
      }))
    );
  }
};
