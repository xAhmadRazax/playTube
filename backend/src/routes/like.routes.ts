// import { Router } from 'express';
// import {
//     getLikedVideos,
//     toggleCommentLike,
//     toggleVideoLike,
//     toggleTweetLike,
// } from "../controllers/like.controller.js"
// import { protect } from '../middlewares/auth.middleware.js';
// const router = Router();
// router.use(protect); // Apply verifyJWT middleware to all routes in this file

// router.route("/toggle/v/:videoId").post(toggleVideoLike);
// router.route("/toggle/c/:commentId").post(toggleCommentLike);
// router.route("/toggle/t/:tweetId").post(toggleTweetLike);
// router.route("/videos").get(getLikedVideos);

// export default router

import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { likeResourceSchema } from "../schemas/like.schema.js";
import { zodSchemaValidation } from "../middlewares/zodSchemaValidation.middleware.js";
import {
  getLikedVideos,
  toggleResourceLike,
} from "../controllers/like.controller.js";

const router = Router();

router.use(protect);

router
  .route("/toggle/:id")
  .post(zodSchemaValidation(likeResourceSchema), toggleResourceLike);

router.route("/videos").get(getLikedVideos);
export { router };
