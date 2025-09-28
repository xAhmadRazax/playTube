import { z as zod } from "zod";

export const videoPublishSchema = zod.object({
  video: zod.url({
    error: (iss) =>
      iss.input === undefined
        ? "Video is required."
        : "Please provide a valid Video.",
  }),
  thumbnail: zod.string({
    error: (iss) =>
      iss.input === undefined
        ? "Thumbnail is required."
        : "Please provide a valid Thumbnail.",
  }),
  title: zod
    .string({
      error: (iss) =>
        iss.input === undefined
          ? "Title is required."
          : "Please provide a valid Title.",
    })
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
    error:
      "At least one field (title, description, or thumbnail) must be provided.",
    path: [], // apply to the overall object
  });
export type updateVideoType = zod.infer<typeof updateVideoSchema>;
