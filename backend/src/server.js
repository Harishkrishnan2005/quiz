import dns from "node:dns";

import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { seedInitialData } from "./data/seedData.js";
import { app } from "./app.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const startServer = async () => {
  await connectDB();
  await seedInitialData();

  app.listen(env.port, () => {
    console.log(`SkillForge API listening on port ${env.port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start SkillForge API", error);
  process.exit(1);
});
