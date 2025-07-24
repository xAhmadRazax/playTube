// import { Router } from 'express';
// import {
//     addComment,
//     deleteComment,
//     getVideoComments,
//     updateComment,
// } from "../controllers/comment.controller.js"
// import { protect } from '../middlewares/auth.middleware.js';
// const router = Router();

// router.use(protect); // Apply verifyJWT middleware to all routes in this file

// router.route("/:videoId").get(getVideoComments).post(addComment);
// router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

// export default router

import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { createComment } from "../controllers/comment.controller.js";

const router = Router();

router.use(protect);
router.route("/").post(createComment);
export { router };
