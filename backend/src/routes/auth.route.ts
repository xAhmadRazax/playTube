import { Router } from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  verifyUser,
  sendVerifyEmail,
  forgotPassword,
  verifyPasswordResetToken,
  resetPassword,
  checkIdentifier,
} from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { validationAndFileCleanupHandler } from "../middlewares/validationAndFileCleanup.middleware.js";
import {
  ChangePasswordSchema,
  LoginSchema,
  RegisterSchema,
  updateCoverImageSchema,
  UpdateUserImagesSchema,
} from "../schemas/auth.schema.js";
import { zodSchemaValidation } from "../middlewares/zodSchemaValidation.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/check-identifier").post(checkIdentifier);

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
router.route("/verify-user/:token").get(verifyUser);

router.route("/forgot-password");

router
  .route("/login")
  .post(zodSchemaValidation(LoginSchema, { isAsync: true }), loginUser);

router.route("/logout").get(protect, logoutUser);

router.route("/forgot-password").post(forgotPassword);
router.route("/verify-reset-token/:token").get(verifyPasswordResetToken);
router.route("/reset-password/:token").post(resetPassword);

router.route("/resend-verification").post(protect, sendVerifyEmail);
router
  .route("/change-password")
  .post(zodSchemaValidation(ChangePasswordSchema), protect, changePassword);

router.route("/refresh-token").post(refreshAccessToken);
export { router };
