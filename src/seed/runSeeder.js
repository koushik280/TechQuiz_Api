import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import { seedData } from "./dataSeeder.js";

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");
    await seedData();
    await mongoose.disconnect();
    console.log("Seeding completed and disconnected.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

run();
