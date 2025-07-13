// import { Schema, model } from "mongoose";

// const tweetSchema = new Schema(
//   {
//     content: { type: String, required: true },
//     owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
//   },
//   {
//     discriminatorKey: "type",
//     timestamps: true,
//   }
// );

// export const Tweet = model("Tweet", tweetSchema, "tweets"); // Specify collection name as "tweets"

import { Schema, model } from "mongoose";
import { Post } from "./post.model.js";
import { TweetDocumentType, TweetModelType } from "../types/tweetModel.type.js";

const tweetSchema = new Schema<TweetDocumentType, TweetModelType>({
  content: {
    require: [true, "tweet Content is missing"],
    type: String,
  },
  image: {
    type: String,
  },
});

export const Tweet = Post.discriminator<TweetDocumentType, TweetModelType>(
  "Tweet",
  tweetSchema,
  "tweets"
);
