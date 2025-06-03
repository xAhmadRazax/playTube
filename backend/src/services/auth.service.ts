import { StatusCodes } from "http-status-codes";
import { Request } from "express";
import { User } from "../models/User.model.js";
import { PublicUserType, UserDocumentType } from "../types/userModel.type.js";
import { ApiErrorV1, AppErrorV4 } from "../utils/ApiError.util.js";
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";
import { LoginUserType, RegisterUserType } from "../schemas/auth.schema.js";
import {
  generateAccessAndRefreshTokenV1,
  verifyAndDecodeJwtToken,
} from "../utils/jwtHandler.util.js";
import { BlacklistModel } from "../models/Blacklist.model.js";
import { UserSession } from "../models/UserSession.model.js";

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
  const avatar = await uploadOnCloudinary(avatarLocalPath!);
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
export const loginService = async (
  { identifier, password }: LoginUserType,
  device: string,
  ip: string
): Promise<{
  user: PublicUserType;
  refreshToken: string;
  accessToken: string;
}> => {
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
    throw new AppErrorV4(
      StatusCodes.UNAUTHORIZED,
      "Invalid entered password.",
      {
        errorCode: "ERR_INVALID_CREDENTIALS",
      }
    );
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
export const logoutService = async (refreshToken: string) => {
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
    throw new AppErrorV4(
      StatusCodes.UNAUTHORIZED,
      "Invalid entered password.",
      {
        errorCode: "ERR_INVALID_CREDENTIALS",
      }
    );
  }

  user.password = newPassword;
  // await user.save();
  const { accessToken, refreshToken } = generateAccessAndRefreshTokenV1(user);
  // updating refresh Token
  // UserSession.deleteMany({
  //   userid: user._id,
  // }),
  // UserSession.create({ userId: user.id, refreshToken }),
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

export const getCurrentUserService = async (
  userId: string
): Promise<PublicUserType> => {
  const user = await User.findById(userId);

  return user!.toJSON();
};

export const updateCurrentUserService = async (
  userId: string,
  data: Record<string, string>
): Promise<PublicUserType> => {
  if (data.newPassword || data.currentPassword) {
    throw new AppErrorV4(
      StatusCodes.BAD_REQUEST,
      `Password updates are not allowed via this route. Please use "/changePassword" for password changes.`,
      {
        errorCode: "ERR_UPDATE_NON_SENSITIVE_FIELDS_ONLY",
      }
    );
  }

  const sensitiveFields = [
    "username",
    "email",
    "createdAt",
    "updatedAt",
    "passwordChangeAt",
    "passwordResetToken",
    "passwordResetExpiry",
    "roles",
    "refreshTokens",
  ];

  const allowedFields: Record<string, string> = {};
  Object.keys(data).forEach((key) => {
    if (!sensitiveFields.includes(key)) {
      allowedFields[key] = data[key];
    }
  });

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        ...data,
      },
    },
    {
      new: true,
    }
  );

  return user!.toJSON();
};

export const updateAvatarUserService = async (
  userId: string,
  localFile: string
): Promise<PublicUserType> => {
  const avatar = await uploadOnCloudinary(localFile);
  if (!avatar?.url) {
    throw new AppErrorV4(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Something went wrong while uploading Avatar to cloudinary",
      {
        errorCode: "ERR_UPLOADING_CLOUDINARY",
      }
    );
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    {
      new: true,
    }
  );

  return user!.toJSON();
};
export const updateUserImageService = async (
  userId: string,
  localFiles: Record<string, string>
): Promise<PublicUserType> => {
  const fieldsName: string[] = [];
  const promiseArr: Promise<any>[] = [];
  Object.keys(localFiles).forEach((key) => {
    fieldsName.push(key);
    promiseArr.push(uploadOnCloudinary(localFiles[key]));
  });

  const resolvePromises = await Promise.all(promiseArr);
  const updatedFields: Record<string, string> = {};
  resolvePromises.forEach((item, index) => {
    if (!item?.url) {
      throw new AppErrorV4(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Something went wrong while uploading ${fieldsName.at(index)} to cloudinary`,
        {
          errorCode: "ERR_UPLOADING_CLOUDINARY",
        }
      );
    }
    updatedFields[fieldsName[index]] = item.url;
  });

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        ...updatedFields,
      },
    },
    {
      new: true,
    }
  );

  return user!.toJSON();
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
      throw new AppErrorV4(
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
    throw new AppErrorV4(
      StatusCodes.UNAUTHORIZED,
      "Invalid token or user no longer exist.",
      {
        errorCode: "ERR_JWT_USER_NOT_FOUND",
      }
    );
  }
  // 4) check if password is changed after jwt is issued
  if (user?.hasPasswordChangedAfterJWTTokenIssued(decoded.iat!)) {
    throw new AppErrorV4(
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
