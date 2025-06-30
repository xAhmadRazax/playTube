import { z as zod } from "zod";

export const videoPublishSchema = zod.object({
  video: zod.string({ required_error: "Video is required." }),
  thumbnail: zod.string({ required_error: "Thumbnail is required." }),
  title: zod
    .string({ required_error: "Title is required." })
    .trim()
    .min(3, "Title must be 3 or more char longer."),
  description: zod
    .string()
    .trim()
    .min(3, "description must be 3 or more char longer.")
    .optional(),
});
export type VideoPublishType = zod.infer<typeof videoPublishSchema>;

export const updateVideoSchema = zod
  .object({
    title: zod
      .string()
      .trim()
      .min(3, "Title must be 3 or more char longer.")
      .optional(),
    description: zod
      .string()
      .trim()
      .min(3, "description must be 3 or more char longer.")
      .optional(),
    thumbnail: zod.string().optional(),
  })
  .refine((data) => data.title || data.description || data.thumbnail, {
    message:
      "At least one field (title, description, or thumbnail) must be provided.",
    path: [], // apply to the overall object
  });
export type updateVideoType = zod.infer<typeof updateVideoSchema>;
