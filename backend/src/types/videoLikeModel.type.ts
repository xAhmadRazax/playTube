import { Document, Model, Schema } from "mongoose";
import { LikeDocumentType } from "./like.type.js";

export interface VideoLikeType extends LikeDocumentType {
  resourceType: "video";
  videoId: Schema.Types.ObjectId; // 👈 change here from string to Types.ObjectId
  type: "like" | "dislike";
}

export interface VideoLikeDocumentType extends VideoLikeType, Document {}
export interface VideoLikeModelType extends Model<VideoLikeDocumentType> {}
