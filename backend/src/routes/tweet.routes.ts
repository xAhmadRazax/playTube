// import { Router } from 'express';
// import {
//     createTweet,
//     deleteTweet,
//     getUserTweets,
//     updateTweet,
// } from "../controllers/tweet.controller.js"
// import { protect } from '../middlewares/auth.middleware.js';

// const router = Router();
// router.use(protect); // Apply verifyJWT middleware to all routes in this file

// router.route("/").post(createTweet);
// router.route("/user/:userId").get(getUserTweets);
// router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);

// export default router

import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  deleteTweet,
  getTweetById,
  getUserTweets,
  updateTweet,
} from "../controllers/tweet.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createTweet } from "../controllers/post.controller.js";

const router = Router();

router.route("/:tweetId").get(getTweetById);

router.use(protect);

router
  .route("/")
  .post(upload.fields([{ name: "coverImage", maxCount: 1 }]), createTweet);

router.route("/user/:userId").get(getUserTweets);

router
  .route("/:tweetId")
  .patch(upload.fields([{ name: "coverImage", maxCount: 1 }]), updateTweet)
  .delete(deleteTweet);

export { router };
