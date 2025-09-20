import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/apiError.util.js";
import { Settings } from "../models/settings.model.js";

export const updateSettingsService = async (data: {
  siteLogo?: string;
  siteLogoSVG?: string;
  siteName?: string;
  email?: string;
}) => {
  if (
    !data?.siteName &&
    !data?.email &&
    !data?.siteLogo &&
    !data?.siteLogoSVG
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Please enter the required fields (siteName (or/and) Email (or/and) siteLogo (for email) (or/and) SiteLogoSVG)"
    );
  }

  return await Settings.updateOne(
    { _id: "singleton" },
    { $set: data },
    { upsert: true }
  );
};

export const getPublicSettingsService = async () => {
  const settings = await Settings.findById("singleton");
  if (!settings) {
    throw new AppError(StatusCodes.NOT_FOUND, "Settings not found");
  }

  return {
    siteLogo: settings.siteLogo,
    siteLogoSVG: settings.siteLogoSVG,
    siteName: settings.siteName,
    email: settings.email,
  };
};
