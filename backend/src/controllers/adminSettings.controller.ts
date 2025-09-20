import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/apiError.util.js";
import { Settings } from "../models/settings.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { Request, Response } from "express";
import { ApiResponseV3 } from "../utils/apiResponse.util.js";
import {
  getPublicSettingsService,
  updateSettingsService,
} from "../services/settings.service.js";

export const updateSettings = asyncHandler(
  async (req: Request, res: Response) => {
    const { siteName, email } = req.body;

    const data = { siteName, email };
    if (!data.siteName && !data.email) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Please enter the required fields (siteName or Email)"
      );
    }

    const updatedSettings = await updateSettingsService({
      siteName: data.siteName,
      email: data.email,
    });

    ApiResponseV3.sendJSON(
      res,
      StatusCodes.OK,
      "Settings updated successfully"
    );
  }
);

export const getPublicSettings = asyncHandler(
  async (req: Request, res: Response) => {
    const settings = await getPublicSettingsService();

    ApiResponseV3.sendJSON(res, StatusCodes.OK, "fetched data successfully", {
      ...settings,
    });
  }
);
