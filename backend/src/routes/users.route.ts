import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getMe,
  getUserChannelProfile,
  getUserWatchHistory,
  updateMe,
  updateMyImages,
} from "../controllers/users.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { validationAndFileCleanupHandler } from "../middlewares/validationAndFileCleanup.middleware.js";
import { UpdateUserImagesSchema } from "../schemas/auth.schema.js";

const router = Router();
router.route("/me").get(protect, getMe);
router.route("/updateMe").post(protect, updateMe);
router.route("/updateMyImage").post(
  protect,
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  validationAndFileCleanupHandler(UpdateUserImagesSchema),
  updateMyImages
);
router.route("/ChannelProfile/:username").get(protect, getUserChannelProfile);
router.route("/history").get(protect, getUserWatchHistory);

export { router };
