import { Router } from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  getCurrentUser,
  updateCurrentUser,
  updateAvatar,
} from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  validationAndFileCleanupHandler,
  validationAndFileCleanupHandlerV1,
} from "../middlewares/validationAndFileCleanup.middleware.js";
import {
  changePasswordSchema,
  LoginSchema,
  RegisterSchema,
  updateAvatarSchema,
} from "../schemas/auth.schema.js";
import { zodSchemaValidation } from "../middlewares/zodSchemaValidation.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(
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
  validationAndFileCleanupHandler(RegisterSchema),
  registerUser
);

router
  .route("/login")
  .post(zodSchemaValidation(LoginSchema, { isAsync: true }), loginUser);

router.route("/logout").get(protect, logoutUser);
router
  .route("/change-password")
  .post(zodSchemaValidation(changePasswordSchema), protect, changePassword);

router.route("/me").get(protect, getCurrentUser);
router.route("/updateMe").post(protect, updateCurrentUser);
router.route("/updateMedia").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  validationAndFileCleanupHandlerV1(updateAvatarSchema),
  updateAvatar
);
router.route("/refresh-token").post(refreshAccessToken);
export { router };
