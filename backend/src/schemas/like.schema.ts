import { z as zod } from "zod";
export const likeResourceSchema = zod
  .object({
    resourceType: zod.enum(["video", "comment", "tweet"], {
      errorMap: () => ({
        message: "Resource type must be one of: video, comment, tweet.",
      }),
    }),
    type: zod.enum(["like", "dislike"], {
      errorMap: () => ({ message: "Type must be either 'like' or 'dislike'." }),
    }),
  })
  .superRefine((data, ctx) => {
    if (!data.resourceType) {
      ctx.addIssue({
        path: ["resourceType"],
        code: zod.ZodIssueCode.custom,
        message: "resourceType is required.",
      });
    }
    if (!data.type) {
      ctx.addIssue({
        path: ["type"],
        code: zod.ZodIssueCode.custom,
        message: "type is required.",
      });
    }
  });
export type LikeResourceType = zod.infer<typeof likeResourceSchema>;
