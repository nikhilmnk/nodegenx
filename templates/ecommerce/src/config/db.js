import mongoose from "mongoose";
import chalk from "chalk";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(chalk.green("✅ MongoDB connected!"));
  } catch (err) {
    console.error(chalk.red("❌ MongoDB connection error:", err));
    process.exit(1);
  }
}
