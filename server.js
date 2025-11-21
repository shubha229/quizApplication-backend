import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Question from "./models/Question.js";
import Score from "./models/Score.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* -----------------------------------
   CONNECT MONGODB → FORCE DB = "test"
------------------------------------- */
mongoose.connect(process.env.MONGO_URI, {
    dbName: "test"      // 🔥 ensures all writes go to test DB
})
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


/* -----------------------
       SAVE SCORE
----------------------- */
app.post("/api/score", async (req, res) => {
  try {
    const { username, domain, score, total } = req.body;

    const newScore = new Score({
      username,
      domain,
      score,
      total
    });

    await newScore.save();

    res.json({ success: true, message: "Score saved successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Error saving score" });
  }
});


/* -----------------------
       GET ALL SCORES
----------------------- */
app.get("/api/score/all", async (req, res) => {
  try {
    const allScores = await Score.find().sort({ createdAt: -1 });
    res.json(allScores);
  } catch (err) {
    res.status(500).json({ error: "Error fetching scores" });
  }
});


/* -----------------------
       START SERVER
----------------------- */
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
