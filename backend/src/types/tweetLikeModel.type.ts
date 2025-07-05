import { Document, Model, Schema } from "mongoose";
import { LikeDocumentType } from "./like.type.js";
export interface TweetLikeType extends LikeDocumentType {
  resourceType: "tweet";
  tweetId: Schema.Types.ObjectId;
  type: "like" | "dislike";
}
export interface TweetLikeDocumentType extends TweetLikeType, Document {}
export interface TweetLikeModelType extends Model<TweetLikeDocumentType> {}
