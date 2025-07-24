import { Router } from "express";
import { Blog } from "../models/blog.model.js";
import { TipTapNode } from "../types/TipTap.type.js";
import { zodSchemaValidation } from "../middlewares/zodSchemaValidation.middleware.js";
import { createTweet } from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { validationAndFileCleanupHandler } from "../middlewares/validationAndFileCleanup.middleware.js";
import { tweetPostSchema } from "../schemas/post.echema.js";

const router = Router();

router
  .route("/")
  .post(
    upload.fields([{ name: "coverImage", maxCount: 1 }]),
    validationAndFileCleanupHandler(tweetPostSchema),
    createTweet
  );
export { router };
