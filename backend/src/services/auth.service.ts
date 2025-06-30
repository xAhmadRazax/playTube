import { StatusCodes } from "http-status-codes";
import { User } from "../models/user.model.js";
import { PublicUserType, UserDocumentType } from "../types/userModel.type.js";
import { AppError } from "../utils/apiError.util.js";
import { LoginUserType, RegisterUserType } from "../schemas/auth.schema.js";
import {
  generateAccessAndRefreshTokenV1,
  verifyAndDecodeJwtToken,
} from "../utils/jwtHandler.util.js";
import { BlacklistModel } from "../models/blacklist.model.js";
import { UserSession } from "../models/userSession.model.js";
import { cloudinaryService } from "./cloudinary.service.js";

export const registerService = async (
  // req: Request,
  {
    username,
    fullName,
    email,
    password,
    avatar: avatarLocalPath,
    coverImage: coverImageLocalPath,
  }: RegisterUserType
): Promise<UserDocumentType> => {
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
  // const avatar = await uploadOnCloudinary(avatarLocalPath!,username,"profile");
  const avatar = await cloudinaryService.uploadMedia(avatarLocalPath, {
    folder: `profile/${user.id}`,
  });

  let coverImage;
  if (coverImageLocalPath) {
    coverImage = await cloudinaryService.uploadMedia(coverImageLocalPath, {
      folder: `profile/${user.id}`,
    });
  }
  //  changing localPath to cloudinary
  user.avatar = avatar?.url || undefined;
  user.coverImage = coverImage?.url || undefined;

  // updating database with new images url
  await user.save();
  // return it
  return user;
};
export const loginService = async (
  { identifier, password }: LoginUserType,
  device: string,
  ip: string
): Promise<{
  user: PublicUserType;
  refreshToken: string;
  accessToken: string;
}> => {
  let user = await User.findOne({
    $or: [
      {
        email: identifier,
      },
      { username: identifier },
    ],
  }).select("+password");

  if (!user || !(await user?.isPasswordCorrect?.(password))) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid entered password.", {
      errorCode: "ERR_INVALID_CREDENTIALS",
    });
  }
  // // generate tokens
  const { accessToken, refreshToken } = generateAccessAndRefreshTokenV1(user);

  await UserSession.create({
    userId: user.id,
    refreshToken,
    deviceInfo: device,
    ipAddress: ip,
  });

  // Exclude password and refreshToken before returning user

  const { password: _password, ...publicUser } = user.toObject();

  return {
    user: publicUser,
    refreshToken: refreshToken || "",
    accessToken: accessToken || "",
  };
};
export const logoutService = async (refreshToken: string) => {
  if (refreshToken) {
    await UserSession.deleteOne({
      refreshToken: refreshToken,
    });
  }
};
export const changePasswordService = async (
  userId: string,
  data: { currentPassword: string; newPassword: string },
  device: string,
  ipAddress: string
): Promise<{
  refreshToken: string;
  accessToken: string;
  user: PublicUserType;
}> => {
  const { currentPassword, newPassword } = data;

  const user = await User.findById(userId).select("+password");
  if (!user || !(await user.isPasswordCorrect(currentPassword))) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid entered password.", {
      errorCode: "ERR_INVALID_CREDENTIALS",
    });
  }

  user.password = newPassword;
  // await user.save();
  const { accessToken, refreshToken } = generateAccessAndRefreshTokenV1(user);
  // updating refresh Token

  await Promise.all([
    user.save(),
    UserSession.deleteMany({
      userId: user._id,
    }).exec(),
    UserSession.create({
      userId: user.id,
      refreshToken,
      deviceInfo: device,
      ipAddress,
    }),
  ]);

  return {
    accessToken,
    refreshToken,
    user: user.toJSON(),
  };
};

export const tokenRefreshService = async (
  refreshToken: string,
  deviceInfo: string,
  ipAddress: string
): Promise<{
  accessToken: string;
  refreshToken: string;
  user: PublicUserType;
}> => {
  // 1) Check if token exists
  // if (!(await UserSession.findOne({ token: refreshToken  }))) {
  //   throw new AppError(
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
  //   throw new AppError(
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
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "Possible token reuse detected. User session has been cleared.",
        {
          errorCode: "ERR_JWT_REUSED",
        }
      );
    }
  }
  // 3B) User doesnt exist any more
  if (!user) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "Invalid token or user no longer exist.",
      {
        errorCode: "ERR_JWT_USER_NOT_FOUND",
      }
    );
  }
  // 4) check if password is changed after jwt is issued
  if (user?.hasPasswordChangedAfterJWTTokenIssued(decoded.iat!)) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "Session Expired. Please login again to access this resource.",
      {
        errorCode: "ERR_PASSWORD_CHANGED",
      }
    );
  }

  // 5) generating tokens and storing refresh token db
  const { accessToken, refreshToken: newRefreshToken } =
    generateAccessAndRefreshTokenV1(user!);

  // const filterRefreshTokens = user!.refreshTokens.filter(
  // (rt) => rt !== refreshToken
  // );
  // delete old token and add new token ? its funny XDDDDD

  await Promise.all([
    UserSession.deleteOne({
      userId: user!.id,
      refreshToken,
    }).exec(),
    UserSession.create({
      userId: user!.id,
      refreshToken: newRefreshToken,
      deviceInfo,
      ipAddress,
    }),
  ]);

  // user!.refreshTokens = [...filterRefreshTokens, newRefreshToken];
  // user!.save({ validateBeforeSave: false });

  // await user!.updateRefreshToken(filterRefreshTokens, newRefreshToken);
  const { password: _password, ...publicUser } = user!.toObject();

  return { accessToken, refreshToken: newRefreshToken, user: publicUser };
};
