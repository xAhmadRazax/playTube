import { Model } from "mongoose";
import { UserDocumentType } from "./userModel.type.js";

export interface PostSchemaType {
  owner: UserDocumentType;
  isPublished: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface PostDocumentType extends PostSchemaType, Document {
  paginate: any;
}
export interface PostModelType extends Model<PostDocumentType> {}
