import { Schema, model } from "mongoose";
import { VideoDocumentType, VideoModelType } from "../types/videoModel.type.js";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema<VideoDocumentType, VideoModelType>(
  {
    title: {
      type: String,
      required: [true, "A video must have a title"],
    },
    description: {
      type: String,
    },
    duration: {
      type: Number,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    thumbnail: {
      type: String,
      required: [true, "A video must have a thumbnail"],
    },
    videoFile: {
      type: String,
      required: [true, "A video must have a videoFile"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// (videoSchema.plugin as any)(mongooseAggregatePaginate);
videoSchema.plugin(mongooseAggregatePaginate);

export const Video = model<VideoDocumentType, VideoModelType>(
  "Video",
  videoSchema
);
