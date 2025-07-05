import { Document, Model, Schema } from "mongoose";
import { LikeDocumentType } from "./like.type.js";
export interface CommentLikeType extends LikeDocumentType {
  resourceType: "comment";
  commentId: Schema.Types.ObjectId;
  type: "like" | "dislike";
}
export interface CommentLikeDocumentType extends CommentLikeType, Document {}
export interface CommentLikeModelType extends Model<CommentLikeDocumentType> {}
