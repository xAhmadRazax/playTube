import { model, Schema, Types } from "mongoose";
import { LikeDocumentType, LikeModelType } from "../types/like.type.js";

const likeSchema = new Schema<LikeDocumentType, LikeModelType>(
  {
    // video: { type: Schema.Types.ObjectId, ref: "Video", required: true },
    // comment: { type: Schema.Types.ObjectId, ref: "Comment", required: true },
    // tweet: { type: Schema.Types.ObjectId, ref: "Tweet", required: true },
    // likedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["like", "dislike"],
      default: "like",
    },
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user id is missing."],
    },
  },

  {
    discriminatorKey: "resourceType",
    timestamps: true,
  }
);

export const Like = model<LikeDocumentType, LikeModelType>("Like", likeSchema);
