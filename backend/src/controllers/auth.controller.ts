import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiResponseV3 } from "../utils/apiResponse.util.js";

import { StatusCodes } from "http-status-codes";
import {
  registerService,
  loginService,
  logoutService,
  changePasswordService,
  tokenRefreshService,
  verifyUserService,
  sendVerifyEmailService,
  forgotPasswordService,
  verifyPasswordResetTokenService,
  resetPasswordService,
  checkIdentifierService,
} from "../services/auth.service.js";
import { AppError } from "../utils/apiError.util.js";

export const checkIdentifier = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { identifier } = req.body;

    const identifierAvailable = await checkIdentifierService(identifier);

    ApiResponseV3.sendJSON(
      res,
      identifierAvailable ? StatusCodes.OK : StatusCodes.CONFLICT,
      identifierAvailable
        ? "This identifier is available."
        : "This identifier is already in use. Please choose a different one.",
      {
        available: identifierAvailable,
      }
    );
  }
);

//creates a new unverified user (can only watch videos)
export const registerUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // getting files from multer
    const files = req.files as { [key: string]: Express.Multer.File[] };

    //   getting local path of images
    const avatarLocalPath =
      files?.avatar?.length > 0 ? files?.avatar[0]?.path : null;
    const coverImageLocalPath =
      files?.coverImage?.length > 0 ? files?.coverImage[0]?.path : null;

    // getting data from user (request body)

    const url = `${req.protocol}://${req.get("host")}${req.baseUrl}`;

    const {
      username,
      // fullName,
      email,
      password,
      dateOfBirth,
      gender,
    } = req.body;
    const user = await registerService(
      {
        username,
        // fullName,
        email,
        password,
        avatar: avatarLocalPath || "",
        coverImage: coverImageLocalPath || "",
        dateOfBirth,
        gender,
      },
      url
    );
    ApiResponseV3.sendJSON(
      res,
      StatusCodes.CREATED,
      "User created successfully.",
      user
    );
  }
);
export const verifyUser = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;
  if (!token) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Verify Token is missing");
  }

  await verifyUserService(token);

  ApiResponseV3.sendJSON(res, StatusCodes.OK, "User was verify successfully");
});
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

export const sendVerifyEmail = asyncHandler(
  async (req: Request, res: Response) => {
    const url = `${req.protocol}://${req.get("host")}${req.baseUrl}`;

    await sendVerifyEmailService(req.user.id, url);

    ApiResponseV3.sendJSON(
      res,
      StatusCodes.OK,
      "verifying email Send Successfully"
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
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Email is missing", {
        errorCode: "ERR_MISSING_EMAIL",
      });
    }
    const url = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    await forgotPasswordService(email, url);

    ApiResponseV3.sendJSON(
      res,
      StatusCodes.OK,
      "If an account with that email exists, a password reset link has been sent."
    );
  }
);

export const verifyPasswordResetToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.params;

    if (!token) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Token is missing", {
        errorCode: "ERR_TOKEN_MISSING",
      });
    }

    await verifyPasswordResetTokenService(token);

    ApiResponseV3.sendJSON(res, StatusCodes.OK, "Token is valid");
  }
);
export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;
    const { password } = req.body;
    if (!token) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Token is missing", {
        errorCode: "ERR_TOKEN_MISSING",
      });
    }
    const updatedUser = await resetPasswordService(password, token);

    ApiResponseV3.sendJSON(
      res,
      StatusCodes.OK,
      "Password updated Successfully",
      { data: updatedUser }
    );
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
