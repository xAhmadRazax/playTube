import { Model } from "mongoose";
export interface SettingsSchemaType {
  _id: string;
  email: string;
  siteName: string;
  password: string;
  siteLogo: string;
  siteLogoSVG: string;
  welcomeAndVerifyEmailTemplate: string;
  forgotPasswordEmailTemplate: string;
  verifyEmailTemplate: string;
}
export interface SettingsDocumentType extends SettingsSchemaType, Document {}
export interface SettingsModelType extends Model<SettingsDocumentType> {}
