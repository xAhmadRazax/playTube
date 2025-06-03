import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { AppError } from "../utils/ApiError.util.js";
import { StatusCodes } from "http-status-codes";
import { verifyAndDecodeJwtToken } from "../utils/jwtHandler.util.js";
import { User } from "../models/User.model.js";

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken =
      req.cookies?.accessToken ||
      (req.headers?.authorization?.startsWith("Bearer ")
        ? (req.headers.authorization as string)?.split(" ")[1]
        : null);

    if (!accessToken) {
      // renew access token and then come backs
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        "You must be logged in to access this resource.",
        {
          errorCode: "ERR_JWT_MISSING",
        }
      );
    }

    const decoded = verifyAndDecodeJwtToken(accessToken);

    if (!decoded || !decoded.iat || !decoded.id) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        "Invalid or Expired Token, Please login again.",
        {
          errorCode: "ERR_JWT_INVALID",
        }
      );
    }
    const user = await User.findById(decoded.id).exec();

    // checking if user exist
    if (!user) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        "Invalid token or user no longer exist.",
        {
          errorCode: "ERR_USER_NOT_FOUND",
        }
      );
    }
    // checking if password of user was changed after token was issued

    if (user.hasPasswordChangedAfterJWTTokenIssued(decoded.iat!)) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        "Session Expired. Please login again to access this resource.",
        {
          errorCode: "ERR_PASSWORD_CHANGED",
        }
      );
    }

    req.user = user;
    next();
  }
);
