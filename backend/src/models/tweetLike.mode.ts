import { Schema } from "mongoose";
import { Like } from "./like.model.js";
import {
  TweetLikeDocumentType,
  TweetLikeModelType,
} from "../types/tweetLikeModel.type.js";
const TweetLikeSchema = new Schema<TweetLikeDocumentType, TweetLikeModelType>({
  tweetId: {
    type: Schema.Types.ObjectId,
    ref: "Tweet",
  },
});
TweetLikeSchema.index({ likedBy: 1, tweetId: 1 }, { unique: true });
export const TweetLike = Like.discriminator<
  TweetLikeDocumentType,
  TweetLikeModelType
>("tweet", TweetLikeSchema);
