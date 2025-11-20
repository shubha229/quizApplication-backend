import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Question from "./models/Question.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✔"))
  .catch(err => console.log(err));

/* -----------------------
   GET ALL DOMAIN NAMES
----------------------- */
app.get("/api/questions/domains", async (req, res) => {
  try {
    const domains = await Question.distinct("domain");
    res.json(domains);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* -----------------------
   GET QUESTIONS BY DOMAIN
----------------------- */
app.get("/api/questions/:domain", async (req, res) => {
  try {
    const domain = req.params.domain;
    const questions = await Question.find({ domain });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
