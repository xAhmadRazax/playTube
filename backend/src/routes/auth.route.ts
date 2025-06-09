import { Router } from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  refreshAccessToken,
  changePassword,

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
  .post(zodSchemaValidation(ChangePasswordSchema), protect, changePassword);


router.route("/refresh-token").post(refreshAccessToken);
export { router };
