import { Document, Model } from "mongoose";
import { UserDocumentType } from "./userModel.type.js";
export interface VideoSchemaType {
  title: string;
  videoFile: string;
  thumbnail: string;
  owner: UserDocumentType;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface VideoDocumentType extends VideoSchemaType, Document {
  paginate: any;
}
export interface VideoModelType extends Model<VideoDocumentType> {}
