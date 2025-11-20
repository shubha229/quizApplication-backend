import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  domain: String,
  question: String,
  options: [String],
  answerIndex: Number
});

const Question = mongoose.model("Question", questionSchema);

export default Question;
