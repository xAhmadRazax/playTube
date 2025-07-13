import { Model } from "mongoose";
import { PostDocumentType } from "./postModel.type.js";

export interface QuizSchemaType extends PostDocumentType {
  content: string;
  options: string[];
  correctOption: "A" | "B" | "C" | "D";
}

export interface QuizDocumentType extends QuizSchemaType, Document {}

export interface QuizModelType extends Model<QuizDocumentType> {}
