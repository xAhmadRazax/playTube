import { Router } from "express";
import {
  getPublicSettings,
  updateSettings,
} from "../controllers/adminSettings.controller.js";

const router = Router();

router.route("/updateSettings").post(updateSettings);

router.route("/get-public-settings").get(getPublicSettings);

export { router };
