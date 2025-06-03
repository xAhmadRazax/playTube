import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiResponseV3 } from "../utils/ApiResponse.util.js";

import { StatusCodes } from "http-status-codes";
import {
  registerService,
  loginService,
  logoutService,
  changePasswordService,
  tokenRefreshService,
  getCurrentUserService,
  updateCurrentUserService,
  updateAvatarUserService,
  updateUserImageService,
} from "../services/auth.service.js";
import { AppError } from "../utils/ApiError.util.js";

export const registerUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // getting files
    const files = req.files as { [key: string]: Express.Multer.File[] };

    //   getting the local path of images
    const avatarLocalPath =
      files?.avatar?.length > 0 ? files?.avatar[0]?.path : null;
    const coverImageLocalPath =
      files?.coverImage?.length > 0 ? files?.coverImage[0]?.path : null;

    // getting data from body
    const { username, fullName, email, password } = req.body;
    const user = await registerService({
      username,
      fullName,
      email,
      password,
      avatar: avatarLocalPath || "",
      coverImage: coverImageLocalPath || "",
    });
    ApiResponseV3.sendJSON(
      res,
      StatusCodes.CREATED,
      "User created successfully.",
      user
    );
  }
);

export const loginUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { identifier, password } = req.body;
    const { user, accessToken, refreshToken } = await loginService(
      {
        identifier,
        password,
      },
      req.headers["user-agent"] || "",
      (Array.isArray(req.headers["x-forwarded-for"])
        ? req.headers["x-forwarded-for"][0]
        : req.headers["x-forwarded-for"]) ||
        req.socket.remoteAddress ||
        ""
    );

    // setting cookies
    const cookieOptions = {
      httpOnly: true,
      sameSite: true,
      secure: false,
    };
    if (process.env.NODE_ENV === "production") {
      cookieOptions.secure = true;
    }

    res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions);

    ApiResponseV3.sendJSON(res, StatusCodes.OK, "User Login successfully.", {
      user: user,
      accessToken,
      refreshToken,
    });
  }
);

export const logoutUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const refreshToken =
      req?.cookies?.refreshToken ||
      (req.headers?.authorization?.startsWith("Bearer ")
        ? req.headers?.authorization?.split(" ")[1]
        : null);

    const cookieOptions = {
      httpOnly: true,
      sameSite: true,
      secure: false,
    };
    if (process.env.NODE_ENV === "production") {
      cookieOptions.secure = true;
    }
    await logoutService(refreshToken);
    res
      .clearCookie("refreshToken", cookieOptions)
      .clearCookie("accessToken", cookieOptions);

    ApiResponseV3.sendJSON(
      res,
      StatusCodes.NO_CONTENT,
      "User logout successfully"
    );
  }
);

export const changePassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken, accessToken, user } = await changePasswordService(
      req.user.id,
      {
        currentPassword: req.body.currentPassword,
        newPassword: req.body.newPassword,
      },
      req.headers["user-agent"] || "",
      (Array.isArray(req.headers["x-forwarded-for"])
        ? req.headers["x-forwarded-for"][0]
        : req.headers["x-forwarded-for"]) ||
        req.socket.remoteAddress ||
        ""
    );

    // setting cookies
    const cookieOptions = {
      httpOnly: true,
      sameSite: true,
      secure: false,
    };
    if (process.env.NODE_ENV === "production") {
      cookieOptions.secure = true;
    }

    res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions);

    ApiResponseV3.sendJSON(
      res,
      StatusCodes.OK,
      "Update user password successfully.",
      {
        refreshToken,
        accessToken,
        user,
      }
    );
  }
);

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await getCurrentUserService(req.user._id);

    ApiResponseV3.sendJSON(
      res,
      StatusCodes.OK,
      "Current user fetched successfully.",
      {
        user,
      }
    );
  }
);

export const updateCurrentUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;

    const user = await updateCurrentUserService(req.user.id, data);

    ApiResponseV3.sendJSON(res, StatusCodes.OK, "User updated successfully.", {
      user,
    });
  }
);
export const updateAvatar = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const files = req?.files as { [key: string]: Express.Multer.File[] };
    const avatar = files?.avatar?.length > 0 ? files.avatar[0].path : null;

    const user = await updateAvatarUserService(req?.user?.id, avatar as string);

    ApiResponseV3.sendJSON(res, StatusCodes.OK, "Updated avatar successfully", {
      user,
    });
  }
);
export const updateUserImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const files = req?.files as { [key: string]: Express.Multer.File[] };
    const fields: Record<string, string> = {};
    Object.keys(files).forEach((key) => {
      if (files[key].length > 0) {
        fields[key] = files[key][0]?.path;
      }
    });

    const user = await updateUserImageService(req?.user?.id, fields);

    ApiResponseV3.sendJSON(res, StatusCodes.OK, "Updated avatar successfully", {
      user,
    });
  }
);
export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const incomingRefreshToken =
      req?.cookies?.refreshToken ||
      (req.headers?.authorization?.startsWith("Bearer ")
        ? req.headers?.authorization?.split(" ")[1]
        : null);

    if (!incomingRefreshToken) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        "Unauthorized access, please login.",
        {
          errorCode: "ERR_JWT_MISSING",
        }
      );
    }

    const { accessToken, refreshToken, user } = await tokenRefreshService(
      incomingRefreshToken,
      req.headers["user-agent"] || "",
      (Array.isArray(req.headers["x-forwarded-for"])
        ? req.headers["x-forwarded-for"][0]
        : req.headers["x-forwarded-for"]) ||
        req.socket.remoteAddress ||
        ""
    );

    ApiResponseV3.sendJSON(
      res,
      StatusCodes.OK,
      "Action token refreshed successfully.",
      {
        refreshToken,
        accessToken,
      }
    );
  }
);
