import mongoose from "mongoose";

import { env } from "./env.js";

export const connectDB = async () => {
  if (!env.mongoUri) {
    throw new Error("MONGO_URI is missing. Update backend/.env before starting the API.");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongoUri);
};
