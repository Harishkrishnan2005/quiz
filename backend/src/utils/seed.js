import { connectDB } from "../config/db.js";
import { seedInitialData } from "../data/seedData.js";

try {
  await connectDB();
  await seedInitialData();
  console.log("Seed completed");
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
