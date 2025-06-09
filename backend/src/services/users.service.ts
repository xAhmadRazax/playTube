import { StatusCodes } from "http-status-codes";
import { User } from "../models/User.model.js";
import { PublicUserType } from "../types/userModel.type.js";
import { AppError } from "../utils/ApiError.util.js";
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";

export const getMeService = async (
  userId: string
): Promise<PublicUserType> => {
  const user = await User.findById(userId);

  return user!.toJSON();
};

export const updateMeService = async (
  userId: string,
  data: Record<string, string>
): Promise<PublicUserType> => {
  if (data.newPassword || data.currentPassword) {
    throw new AppError(
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
    throw new AppError(
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
export const updateMyImagesService = async (
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
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Something went wrong while uploading ${fieldsName.at(index)} to cloudinary`,
        {
          errorCode: "ERR_UPLOADING_CLOUDINARY",
        }
      );
    }
    updatedFields[fieldsName[index]] = item.url;
  });

  // TODO: delete old image
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