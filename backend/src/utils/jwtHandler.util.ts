import { StatusCodes } from "http-status-codes";
import { User } from "../models/user.model.js";
import { AppError } from "./apiError.util.js";
import { UserDocumentType } from "../types/userModel.type.js";
import jwt, { JwtPayload } from "jsonwebtoken";

export const generateAccessAndRefreshToken = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user?.generateAccessToken?.();
    const refreshToken = user?.generateRefreshToken?.();

    if (user && typeof refreshToken === "string") {
      user.refreshTokens = [...user.refreshTokens, refreshToken];
      await user.save({ validateBeforeSave: false });
    }
    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Internal Server Error"
    );
  }
};

export const generateAccessAndRefreshTokenV1 = (
  user: UserDocumentType
): {
  accessToken: string;
  refreshToken: string;
} => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  return {
    accessToken: accessToken as string,
    refreshToken: refreshToken as string,
  };
};

export const verifyAndDecodeJwtToken = (
  token: string,
  isRefreshToken: boolean = false
): JwtPayload => {
  const secret = isRefreshToken
    ? process?.env?.REFRESH_TOKEN_SECRET
    : process?.env?.ACCESS_TOKEN_SECRET;
  if (!isRefreshToken && !process?.env?.ACCESS_TOKEN_SECRET) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `${isRefreshToken ? "Refresh" : "Access"}_TOKEN_SECRET variable is missing in environment.`,
      {
        errorCode: `ERR_ENVIRONMENT_${isRefreshToken ? "Refresh_TOKEN" : "ACCESS_TOKEN"}_VARIABLE_NOT_FOUND`,
      }
    );
  }

  const decodedJWT = jwt.verify(token, secret) as JwtPayload;

  return decodedJWT;
};
