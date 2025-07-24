import { z as zod } from "zod";
import { ALLOWED_IMAGE_MIMES_TYPES } from "../constants.js";

// export const basePostSchema = zod.object({
//   resourceType: zod.enum(["video", "blog", "quiz", "tweet"], {
//     message: "Invalid resource type. Must be one of: video, blog, quiz, tweet.",
//     required_error:
//       "resourceType is required, please enter one of following (video, blog, quiz)",
//   }),
// });

// const videoPostSchema = basePostSchema.extend({
//   resourceType: zod.literal("video"),
//   videoUrl: zod.string().url(),
//   duration: zod.number(),
// });

// const blogPostSchema = basePostSchema.extend({
//   resourceType: zod.literal("blog"),
//   content: zod.string(),
//   title: zod.string(),
// });

// const quizPostSchema = basePostSchema.extend({
//   resourceType: zod.literal("quiz"),
//   questions: zod.array(zod.string()),
// });

// const ResourceSchema = zod.discriminatedUnion("resourceType", [
//   videoPostSchema,
//   blogPostSchema,
//   quizPostSchema,
// ]);

export const tweetPostSchema = zod.object({
  content: zod
    .string({ required_error: "content is required" })
    .min(3, { message: "Content must be at least 3 characters long" })
    .trim(),
  coverImage: zod.custom<File>(
    (file) => {
      return file && ALLOWED_IMAGE_MIMES_TYPES.includes(file.mimetype);
    },
    `Unsupported image type, please select one of following (${ALLOWED_IMAGE_MIMES_TYPES.map(
      (v) => `.${v.split("/")[1]}`
    ).join(" ")})`
  ),
});
