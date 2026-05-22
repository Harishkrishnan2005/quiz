import dotenv from "dotenv";

dotenv.config();

const parseAllowedOrigins = () => {
  const rawOrigins = process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:5173";

  return rawOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin && origin !== "*");
};

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  clientUrls: parseAllowedOrigins(),
  mongoUri: process.env.MONGO_URI || process.env.mongo_url || "",
  jwtSecret: process.env.JWT_SECRET || "development-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  openAiApiKey: process.env.OPENAI_API_KEY || "",
  openAiModel: process.env.OPENAI_MODEL || "gpt-4o-mini"
};
