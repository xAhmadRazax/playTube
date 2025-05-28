import { StatusCodes } from "http-status-codes";
import { User } from "../models/User.model.js";
import { AppErrorV4 } from "../utils/ApiError.util.js";
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";
import { generateAccessAndRefreshTokenV1, verifyAndDecodeJwtToken, } from "../utils/jwtHandler.util.js";
import { UserSession } from "../models/UserSession.model.js";
export const registerService = async (
// req: Request,
{ username, fullName, email, password, avatar: avatarLocalPath, coverImage: coverImageLocalPath, }) => {
    // create user object
    const user = await User.create({
        username: username.toLowerCase(),
        fullName,
        email,
        password,
        // avatar: avatar?.url,
        avatar: avatarLocalPath,
        // coverImage: coverImage?.url || null,
        coverImage: coverImageLocalPath || null,
    });
    //   uploading file to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    let coverImage;
    if (coverImageLocalPath) {
        coverImage = await uploadOnCloudinary(coverImageLocalPath);
    }
    //  changing localPath to cloudinary
    user.avatar = avatar?.url || undefined;
    user.coverImage = coverImage?.url || undefined;
    // updating database with new images url
    await user.save();
    // return it
    return user;
};
export const loginService = async ({ identifier, password }, device, ip) => {
    //   const user = identifier.include("@")
    //     ? await User.findOne({ email: identifier })
    //     : await User.findOne({ username: identifier });
    let user = await User.findOne({
        $or: [
            {
                email: identifier,
            },
            { username: identifier },
        ],
    }).select("+password");
    if (!user || !(await user?.isPasswordCorrect?.(password))) {
        throw new AppErrorV4(StatusCodes.UNAUTHORIZED, "Invalid User Credentials.");
    }
    // // generate tokens
    const { accessToken, refreshToken } = generateAccessAndRefreshTokenV1(user);
    // await user.updateRefreshToken(
    //   // user.refreshTokens,
    //   refreshToken,
    //   device,
    //   ip
    // );
    await UserSession.create({
        userId: user.id,
        refreshToken,
        deviceInfo: device,
        ipAddress: ip,
    });
    // user.refreshToken = [...user?.refreshToken, refreshToken];
    // Exclude password and refreshToken before returning user
    const { password: _password, ...publicUser } = user.toObject();
    return {
        user: publicUser,
        refreshToken: refreshToken || "",
        accessToken: accessToken || "",
    };
};
export const logoutService = async (refreshToken) => {
    // const user = await User.findById(id);
    // TODO:FixMe
    // await user?.updateRefreshToken(user.refreshTokens, refreshToken, true);
    // await user.
    if (refreshToken) {
        await UserSession.deleteOne({
            refreshToken: refreshToken,
        });
    }
    // await BlacklistModel.create({
    //   token: refreshToken,
    // });
};
export const tokenRefreshService = async (refreshToken, deviceInfo, ipAddress) => {
    // 1) Check if token exists
    // if (!(await UserSession.findOne({ token: refreshToken  }))) {
    //   throw new AppErrorV4(
    //     StatusCodes.UNAUTHORIZED,
    //     "Session Expired, please login again.",
    //     {
    //       errorCode: "ERR_JWT_BLACKLIST",
    //     }
    //   );
    // }
    // 2)decode the token it will also check token so dont need to throw error most likely as
    // im already handling invalid token and expiry token case in global error middle
    const decoded = verifyAndDecodeJwtToken(refreshToken, true);
    // if decoded token incase of invalid or other reason start
    // acting strnage just try to uncommit it
    // if (!decoded) {
    //   throw new AppErrorV4(
    //     StatusCodes.UNAUTHORIZED,
    //     "Invalid or Expired Token, Please login again.",
    //     {
    //       errorCode: "ERR_JWT_INVALID",
    //     }
    //   );
    // }
    // 3)  check if the user exist with this token
    // const token = await UserSession.findOne({
    //   refreshToken: refreshToken,
    // }).exec();
    const [token, user] = await Promise.all([
        UserSession.findOne({
            refreshToken: refreshToken,
            userId: decoded.id,
        }).exec(),
        User.findById(decoded.id).exec(),
    ]);
    // let user;
    if (!token) {
        // 3A) token reused detection (JWT is valid but token is not associated with any user)
        if (user) {
            throw new AppErrorV4(StatusCodes.FORBIDDEN, "Possible token reuse detected. User session has been cleared.", {
                errorCode: "ERR_JWT_REUSED",
            });
        }
    }
    // 3B) User doesnt exist any more
    if (!user) {
        throw new AppErrorV4(StatusCodes.UNAUTHORIZED, "Invalid token or user no longer exist.", {
            errorCode: "ERR_JWT_USER_NOT_FOUND",
        });
    }
    // 4) check if password is changed after jwt is issued
    if (user?.hasPasswordChangedAfterJWTTokenIssued(decoded.iat)) {
        throw new AppErrorV4(StatusCodes.UNAUTHORIZED, "Session Expired. Please login again to access this resource.", {
            errorCode: "ERR_PASSWORD_CHANGED",
        });
    }
    // 5) generating tokens and storing refresh token db
    const { accessToken, refreshToken: newRefreshToken } = generateAccessAndRefreshTokenV1(user);
    // const filterRefreshTokens = user!.refreshTokens.filter(
    // (rt) => rt !== refreshToken
    // );
    // delete old token and add new token ? its funny XDDDDD
    await Promise.all([
        UserSession.deleteOne({
            userId: user.id,
            refreshToken,
        }).exec(),
        UserSession.create({
            userId: user.id,
            refreshToken: newRefreshToken,
            deviceInfo,
            ipAddress,
        }),
    ]);
    // user!.refreshTokens = [...filterRefreshTokens, newRefreshToken];
    // user!.save({ validateBeforeSave: false });
    // await user!.updateRefreshToken(filterRefreshTokens, newRefreshToken);
    const { password: _password, ...publicUser } = user.toObject();
    return { accessToken, refreshToken: newRefreshToken, user: publicUser };
};
