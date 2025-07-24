import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// ok this is shit what u mean that for now i can comment on video only hello????

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, "A comment must have content"],
    },
    resource: {
      kind: {
        type: String,
        enum: ["Video", "Comment", "Tweet", "Quiz", "Blog"],
        require: [true, "item Type is missing"],
      },
      item: {
        type: Schema.Types.ObjectId,
        refPath: "resource.kind",
        require: [true, "Item Id is missing"],
      },
    },
    // video: { type: Schema.Types.ObjectId, ref: "Video", required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

commentSchema.plugin(mongooseAggregatePaginate);
export const Comment = model("Comment", commentSchema);
