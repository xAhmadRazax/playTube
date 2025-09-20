import { Schema, model, Types } from "mongoose";
import {
  SettingsDocumentType,
  SettingsModelType,
} from "../types/settings.type.js";

const settingSchema = new Schema<SettingsDocumentType, SettingsModelType>({
  _id: { type: String, default: "singleton" },
  email: String,
  siteName: String,
  siteLogo: String,
  siteLogoSVG: String,
  welcomeAndVerifyEmailTemplate: String,
  forgotPasswordEmailTemplate: String,
  verifyEmailTemplate: String,
});

export const Settings = model<SettingsDocumentType, SettingsModelType>(
  "settings",
  settingSchema
);
