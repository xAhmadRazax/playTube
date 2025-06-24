// import { Router } from 'express';
// import {
//     deleteVideo,
//     getAllVideos,
//     getVideoById,
//     publishAVideo,
//     togglePublishStatus,
//     updateVideo,
// } from "../controllers/video.controller.js"
// import {upload} from "../middlewares/multer.middleware.js"
// import { protect } from '../middlewares/auth.middleware.js';

// const router = Router();
// router.use(protect); // Apply verifyJWT middleware to all routes in this file

// router
//     .route("/")
//     .get(getAllVideos)
//     .post(
//         upload.fields([
//             {
//                 name: "videoFile",
//                 maxCount: 1,
//             },
//             {
//                 name: "thumbnail",
//                 maxCount: 1,
//             },

//         ]),
//         publishAVideo
//     );

// router
//     .route("/:videoId")
//     .get(getVideoById)
//     .delete(deleteVideo)
//     .patch(upload.single("thumbnail"), updateVideo);

// router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

// export default router

import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  deleteVideo,
  getVideoById,
  publishVideo,
  updateVideo,
} from "../controllers/video.controller.js";

const router = Router();
router.use(protect); // Apply verifyJWT middleware to all routes in this file
router.route("/").post(
  upload.fields([
    {
      name: "video",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  // TODO: add schema validation middleware
  publishVideo
);

router
  .route("/:videoId")
  .get(
    // TODO: add schema vaildation here
    getVideoById
  )
  .patch(upload.single("thumbnail"), updateVideo)
  .delete(deleteVideo);
export { router };
