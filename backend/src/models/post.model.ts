import { Schema, model } from "mongoose";
import { PostDocumentType, PostModelType } from "../types/postModel.type.js";

const postSchema = new Schema<PostDocumentType, PostModelType>(
  {
    owner: {
      require: [true, "Owner field is missing"],
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    discriminatorKey: "type",
  }
);

export const Post = model<PostDocumentType, PostModelType>("Post", postSchema);
