import { Schema } from "mongoose";
import { Like } from "./like.model.js";
import {
  VideoLikeDocumentType,
  VideoLikeModelType,
} from "../types/videoLikeModel.type.js";
const videoLikeSchema = new Schema<VideoLikeDocumentType, VideoLikeModelType>({
  videoId: { type: Schema.Types.ObjectId, ref: "Video", required: true },
});
videoLikeSchema.index({ likedBy: 1, videoId: 1 }, { unique: true });

export const VideoLike = Like.discriminator<
  VideoLikeDocumentType,
  VideoLikeModelType
>("video", videoLikeSchema);
