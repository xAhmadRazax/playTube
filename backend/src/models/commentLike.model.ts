import { Schema } from "mongoose";
import { Like } from "./like.model.js";
import {
  CommentLikeDocumentType,
  CommentLikeModelType,
} from "../types/commentLikeModel.type.js";
const commentLikeSchema = new Schema<
  CommentLikeDocumentType,
  CommentLikeModelType
>({
  commentId: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
    required: true,
  },
});
commentLikeSchema.index({ likedBy: 1, commentId: 1 }, { unique: true });
export const CommentLike = Like.discriminator<
  CommentLikeDocumentType,
  CommentLikeModelType
>("comment", commentLikeSchema);
