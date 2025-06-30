import { StatusCodes } from "http-status-codes";
import { User } from "../models/user.model.js";
import { PublicUserType, UserDocumentType } from "../types/userModel.type.js";
import { AppError } from "../utils/apiError.util.js";
import { Types } from "mongoose";
import { cloudinaryService } from "./cloudinary.service.js";
import { DeleteApiResponse, UploadApiResponse } from "cloudinary";

export const getMeService = async (userId: string): Promise<PublicUserType> => {
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
  { userId, username }: { userId: string; username: string },
  localFile: string
): Promise<PublicUserType> => {
  // const avatar = await uploadOnCloudinary(localFile,username, "profile");
  const avatar = await cloudinaryService.uploadMedia(localFile, {
    folder: `profile/${username}`,
  });
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
  user: UserDocumentType,
  localFiles: { avatarLocalPath?: string; coverImageLocalPath?: string }
): Promise<PublicUserType> => {
  const fieldsName: string[] = [];
  const cloudinaryUploaderArr: Promise<UploadApiResponse>[] = [];
  const cloudinaryDeleteArr: Promise<DeleteApiResponse>[] = [];

  Object.entries(localFiles).forEach(([key, item]) => {
    const fieldName = key.split("LocalPath")[0];

    if (fieldName in user && user[fieldName as keyof typeof user]) {
      cloudinaryDeleteArr.push(
        cloudinaryService.deleteMedia(user[fieldName as keyof typeof user], {
          invalidate: true,
        })
      );
    }

    fieldsName.push(fieldName);
    cloudinaryUploaderArr.push(
      cloudinaryService.uploadMedia(item, {
        folder: `${user.id}/profile`,
      })
    );
  });

  const resolvePromises = await Promise.all(cloudinaryUploaderArr);
  // modifying data to the expected format to store in database
  const updatedFields: Record<string, string> = {};

  fieldsName.forEach((key, index) => {
    updatedFields[key] = resolvePromises[index]?.url;
  });

  console.log(updatedFields, "ipdated");
  const updatedUser = await User.findByIdAndUpdate(
    user?.id,
    {
      $set: {
        ...updatedFields,
      },
    },
    {
      new: true,
    }
  );

  const deleteRes = await Promise.all(cloudinaryDeleteArr);

  console.log("deleteRes", deleteRes);
  return updatedUser!.toJSON();
  //  do something to makesure this handles all types of images relreated to user not videos...
};

export const getUserChannelProfileService = async (
  username: string,
  userId: string
): Promise<any[]> => {
  if (!username?.trim()) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Username is required.", {
      errorCode: "ERR_BAD_REQ",
    });
  }

  const channel = await User.aggregate([
    {
      $match: { username: username?.toLowerCase() },
    },

    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: { $size: "$subscribers" },
        subscribedToCount: { $size: "$subscribedTo" },
        isSubscribed: {
          $cond: {
            if: { $in: [userId, "subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        subscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new AppError(StatusCodes.NOT_FOUND, "Channel not found.", {
      errorCode: "ERR_CHANNEL_NOT_FOUND",
    });
  }

  return channel;
};

export const getUserWatchHistoryService = async (userId: string) => {
  const user = await User.aggregate([
    {
      $match: { _id: new Types.ObjectId(String(userId)) },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    username: 1,
                    fullName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: { $first: "$owner" },
            },
          },
        ],
      },
    },
  ]);

  return user;
};
