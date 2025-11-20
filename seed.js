import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import Question from "./models/Question.js";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.resolve();

async function seedQuestions() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected ✔");

    const filePath = path.join(__dirname, "data", "questions.json");
    const rawData = fs.readFileSync(filePath);
    const questions = JSON.parse(rawData);

    await Question.deleteMany({});
    console.log("Old questions removed");

    // Insert directly
    const formatted = questions.map(q => ({
      domain: q.domain,
      question: q.q,
      options: q.options,
      answerIndex: q.answerIndex
    }));

    await Question.insertMany(formatted);

    console.log("All questions inserted successfully 🎉");
    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seedQuestions();
