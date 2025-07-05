import { Document, Model, Types } from "mongoose";
export interface LikeType {
  type: "like" | "dislike";
  likedBy: Types.ObjectId;
}
export interface LikeDocumentType extends LikeType, Document {}
export interface LikeModelType extends Model<LikeDocumentType> {}
