import { Model, Document } from "mongoose";
import { PostDocumentType } from "./postModel.type.js";

export interface TweetSchemaType extends PostDocumentType {
  content: string;
  image: string;
}
export interface TweetDocumentType extends TweetSchemaType, Document {
  paginate: any;
}
export interface TweetModelType extends Model<TweetDocumentType> {}
