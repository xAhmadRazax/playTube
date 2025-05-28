import { Router } from "express";
import { registerUser } from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { validationWithSchema } from "../middlewares/validateInput.middleware.js";
import { RegisterSchema } from "../schemas/auth.schema.js";
const router = Router();
router.route("/register").post(upload.fields([
    {
        name: "avatar",
        maxCount: 1,
    },
    {
        name: "coverImage",
        maxCount: 1,
    },
]), validationWithSchema(RegisterSchema), registerUser);
export { router };
