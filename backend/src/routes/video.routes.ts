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
  togglePublishStatus,
  getAllVideos,
} from "../controllers/video.controller.js";
import { validationAndFileCleanupHandler } from "../middlewares/validationAndFileCleanup.middleware.js";
import {
  updateVideoSchema,
  videoPublishSchema,
} from "../schemas/video.schema.js";
import { zodSchemaValidation } from "../middlewares/zodSchemaValidation.middleware.js";

const router = Router();
router.use(protect); // Apply verifyJWT middleware to all routes in this file
router
  .route("/")
  .get(getAllVideos)
  .post(
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
    validationAndFileCleanupHandler(videoPublishSchema),
    publishVideo
  );

router
  .route("/:videoId")
  .get(getVideoById)
  .patch(
    upload.single("thumbnail"),
    zodSchemaValidation(updateVideoSchema),
    updateVideo
  )
  .delete(deleteVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);
export { router };
