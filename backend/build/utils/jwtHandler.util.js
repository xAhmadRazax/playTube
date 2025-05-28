import { StatusCodes } from "http-status-codes";
import { User } from "../models/User.model.js";
import { AppErrorV4 } from "./ApiError.util.js";
import jwt from "jsonwebtoken";
export const generateAccessAndRefreshToken = async (userId) => {
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
    }
    catch (error) {
        throw new AppErrorV4(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error");
    }
};
export const generateAccessAndRefreshTokenV1 = (user) => {
    // if (!user || !user.generateAccessToken || !user.generateRefreshToken) {
    //   throw new AppErrorV4(
    //     StatusCodes.INTERNAL_SERVER_ERROR,
    //     "Something went wrong, while accessing user and generating tokens.",
    //     {
    //       errorCode: "ERR_INVALID_USER",
    //     }
    //   );
    // }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    // user.refreshToken = [...user.refreshToken, refreshToken];
    // await user.save({ validateBeforeSave: false });
    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
    };
};
export const verifyAndDecodeJwtToken = (token, isRefreshToken = false) => {
    const secret = isRefreshToken
        ? process?.env?.REFRESH_TOKEN_SECRET
        : process?.env?.ACCESS_TOKEN_SECRET;
    if (!isRefreshToken && !process?.env?.ACCESS_TOKEN_SECRET) {
        throw new AppErrorV4(StatusCodes.INTERNAL_SERVER_ERROR, `${isRefreshToken ? "Refresh" : "Access"}_TOKEN_SECRET variable is missing in environment.`, {
            errorCode: `ERR_ENVIRONMENT_${isRefreshToken ? "Refresh_TOKEN" : "ACCESS_TOKEN"}_VARIABLE_NOT_FOUND`,
        });
    }
    const decodedJWT = jwt.verify(token, secret);
    return decodedJWT;
};
