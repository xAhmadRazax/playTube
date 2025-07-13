import { Schema, model } from "mongoose";
import { Post } from "./post.model.js";
import { QuizDocumentType, QuizModelType } from "../types/quizMode.type.js";

const quizSchema = new Schema<QuizDocumentType, QuizModelType>({
  content: {
    type: String,
    required: [true, "Quiz question is required"],
  },
  options: {
    type: [{ type: String, required: true }],
    validate: {
      validator: function (v: string[]) {
        return v.length === 4;
      },
      message: "A quiz must have exactly 4 options",
    },
    required: [true, "Quiz options are required"],
  },
  correctOption: {
    type: String,
    enum: ["A", "B", "C", "D"],
    required: [true, "Correct option index is required"],
  },
});

export const Quiz = Post.discriminator<QuizDocumentType, QuizModelType>(
  "quiz",
  quizSchema
);
