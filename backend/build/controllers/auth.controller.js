import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiResponseV3 } from "../utils/ApiResponse.util.js";
import { StatusCodes } from "http-status-codes";
import { registerService, loginService, logoutService, tokenRefreshService, } from "../services/auth.service.js";
import { AppErrorV4 } from "../utils/ApiError.util.js";
export const registerUser = asyncHandler(async (req, res) => {
    // getting files
    const files = req.files;
    //   getting the local path of images
    const avatarLocalPath = files?.avatar?.length > 0 ? files?.avatar[0]?.path : null;
    const coverImageLocalPath = files?.coverImage?.length > 0 ? files?.coverImage[0]?.path : null;
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
    ApiResponseV3.sendJSON(res, StatusCodes.CREATED, "User created successfully.", user);
});
export const loginUser = asyncHandler(async (req, res) => {
    const { identifier, password } = req.body;
    const { user, accessToken, refreshToken } = await loginService({
        identifier,
        password,
    }, req.headers["user-agent"] || "", (Array.isArray(req.headers["x-forwarded-for"])
        ? req.headers["x-forwarded-for"][0]
        : req.headers["x-forwarded-for"]) ||
        req.socket.remoteAddress ||
        "");
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
});
export const logoutUser = asyncHandler(async (req, res) => {
    const refreshToken = req?.cookies?.refreshToken ||
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
    ApiResponseV3.sendJSON(res, StatusCodes.NO_CONTENT, "User logout successfully");
});
export const refreshAccessToken = asyncHandler(async (req, res, next) => {
    const incomingRefreshToken = req?.cookies?.refreshToken ||
        (req.headers?.authorization?.startsWith("Bearer ")
            ? req.headers?.authorization?.split(" ")[1]
            : null);
    if (!incomingRefreshToken) {
        throw new AppErrorV4(StatusCodes.UNAUTHORIZED, "Unauthorized access, please login.", {
            errorCode: "ERR_JWT_MISSING",
        });
    }
    const { accessToken, refreshToken, user } = await tokenRefreshService(incomingRefreshToken, req.headers["user-agent"] || "", (Array.isArray(req.headers["x-forwarded-for"])
        ? req.headers["x-forwarded-for"][0]
        : req.headers["x-forwarded-for"]) ||
        req.socket.remoteAddress ||
        "");
    ApiResponseV3.sendJSON(res, StatusCodes.OK, "Action token refreshed successfully.", {
        refreshToken,
        accessToken,
    });
});
