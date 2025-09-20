import { z as zod } from "zod";
export const likeResourceSchema = zod.object({
  resourceType: zod.enum(["video", "comment", "tweet"], {
    message: "Resource type must be one of: video, comment, tweet.",
    // error: "Resource type must be one of: video, comment, tweet.",
  }),
  type: zod.enum(["like", "dislike"], {
    message: "Type must be either 'like' or 'dislike'.",
    // error: "Type must be either 'like' or 'dislike'.",
  }),
});
export type LikeResourceType = zod.infer<typeof likeResourceSchema>;
