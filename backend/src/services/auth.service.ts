import fs from "fs";

import { StatusCodes } from "http-status-codes";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

import { Email } from "../utils/Email.js";
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
import { generateRandomIdMongoDb } from "../utils/generateRandomId.util.js";
import { cleanupMedia } from "../utils/cleanupMedia.js";
export const registerService = async (
  // req: Request,
  {
    username,
    fullName,
    email,
    password,
    avatar: avatarLocalPath,
    coverImage: coverImageLocalPath,
  }: RegisterUserType,
  url: string
): Promise<UserDocumentType> => {
  // generating id as we need the id to store user data in cloudinary
  const id = await generateRandomIdMongoDb(User);

  // create user object
  let avatar: UploadApiResponse | null = null;
  let coverImage: UploadApiResponse | null = null;

  try {
    avatar = await cloudinaryService.uploadMedia(avatarLocalPath, {
      folder: `profile/${id}`,
    });
    if (coverImageLocalPath) {
      coverImage = await cloudinaryService.uploadMedia(coverImageLocalPath, {
        folder: `profile/${id}`,
      });
    }

    const user = await User.create({
      _id: id,
      username: username.toLowerCase(),
      fullName,
      email,
      password,
      avatar: avatar?.url,
      coverImage: coverImage?.url,
    });

    const urlVerifyToken = `${url}/verify/${user.generateVerifyToken()}`;

    await (
      await Email.init(user.toJSON(), urlVerifyToken)
    ).sendWelcomeAndVerifyEmail();

    await user.save();
    // TODO: add email generation for verifying account
    return user;
  } catch (error) {
    // now now there are too many condition for which the error could
    // throw
    // 1 uploading on clouding throw some error, in this case delete
    // the local image path as any image upload on to cloudinary
    await cleanupMedia({
      remoteUrls: [avatar?.url, coverImage?.url].filter((url): url is string =>
        Boolean(url)
      ),
      localPaths: [avatarLocalPath, coverImageLocalPath].filter(
        (url): url is string => Boolean(url)
      ),
    });
    // 2 generating email throws some error

    throw error;
  }
};

export const verifyUserService = async (token: string) => {
  const encryptedCryptoToken = User.encryptCryptoToken(token);

  console.log(encryptedCryptoToken);
  const user = await User.findOne({
    emailVerificationToken: encryptedCryptoToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    // throw new AppError(StatusCodes.NOT_FOUND, "Invalid verify Token", {
    //   errorCode: "ERR_INVALID_VERIFY_TOKEN",
    // });
    throw new AppError(StatusCodes.GONE, "Token expired or invalid Token", {
      errorCode: "ERR_EXPIRED_VERIFY_TOKEN",
    });
  }

  // check if the token expreiy time is less than current time

  // if (
  //   user?.emailVerificationExpires &&
  //   new Date(user?.emailVerificationExpires).getTime() < Date.now()
  // ) {
  //   throw new AppError(StatusCodes.GONE, "Token expired", {
  //     errorCode: "ERR_EXPIRED_VERIFY_TOKEN",
  //   });
  // }
  if (user?.isVerified) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is already Verified", {
      errorCode: "ERR_USER_IS_VERIFIED",
    });
  }

  user.isVerified = true;

  user.emailVerificationExpires = undefined;
  user.emailVerificationToken = undefined;
  user.save();
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

export const sendVerifyEmailService = async (userId: string, url: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found.", {
      errorCode: "ERR_USER_NOT_FOUND",
    });
  }

  if (user.isVerified) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is already verified", {
      errorCode: "ERR_USER_IS_VERIFIED",
    });
  }

  const urlVerifyToken = `${url}/verify-user/${user.generateVerifyToken()}`;

  await user.save();
  await (
    await Email.init(user.toJSON(), urlVerifyToken)
  ).sendWelcomeAndVerifyEmail();
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

export const forgotPasswordService = async (email: "string", url: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    return;
  }

  const token = user.generatePasswordResetToken();
  const urlVerifyToken = `${url}/verify-reset-token/${token}`;

  await user.save();
  // send email to user with the verify code
  await (
    await Email.init(user.toJSON(), urlVerifyToken)
  ).sendPasswordResetEmail();
};

export const verifyPasswordResetTokenService = async (token: string) => {
  if (!token) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Token is missing", {
      errorCode: "ERR_TOKEN_MISSING",
    });
  }

  console.log("???????????");
  const user = await User.findOne({
    passwordResetToken: User.encryptCryptoToken(token),
    passwordResetExpiry: { $gt: Date.now() },
  });
  if (!user) {
    throw new AppError(StatusCodes.GONE, "Token is invalid or has expired", {
      errorCode: "ERR_EXPIRE_PASSWORD_RESET_TOKEN",
    });
  }
};

export const resetPasswordService = async (password: string, token: string) => {
  if (!token) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Token is missing", {
      errorCode: "ERR_TOKEN_MISSING",
    });
  }
  const user = await User.findOne({
    passwordResetToken: User.encryptCryptoToken(token),
    passwordResetExpiry: { $gt: Date.now() },
  });
  if (!user) {
    throw new AppError(StatusCodes.GONE, "Token is invalid or has expired", {
      errorCode: "ERR_EXPIRE_PASSWORD_RESET_TOKEN",
    });
  }

  user.password = password;
  user.passwordResetExpiry = undefined;
  user.passwordResetToken = undefined;
  await user.save();

  return user;
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
