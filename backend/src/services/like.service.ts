import { Document, isValidObjectId, Model, Types } from "mongoose";
import { LikeResourceType } from "../schemas/like.schema.js";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/apiError.util.js";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
import { VideoLike } from "../models/videoLike.model.js";
import { CommentLike } from "../models/commentLike.schema.js";
import { Comment } from "../models/comment.model.js";
import { TweetLike } from "../models/tweetLike.mode.js";
import { Tweet } from "../models/tweet.model.js";

const handleResourceLike = async <T extends Document, U extends Document>(
  resourceModel: Model<T>,
  likeModel: Model<U>,
  data: ToggleResourceLikedParamsType,
  userId: string
): Promise<{
  action: "created" | "updated" | "deleted";
  message: string;
  data?: U;
}> => {
  if (!data?.resourceId || !isValidObjectId(data?.resourceId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid Resource ID", {
      errorCode: "ERR_INVALID_RESOURCE_ID",
    });
  }

  // here resource means the video comment tweet
  console.log(data.resourceId, data, "resourse");
  const resourceFound = await resourceModel.findById(data.resourceId);
  console.log(resourceFound);
  if (!resourceFound) {
    throw new AppError(StatusCodes.NOT_FOUND, "Resource not found!", {
      errorCode: "ERR_RESOURCE_NOT_FOUND",
    });
  }

  // try to find the comment
  const foundLikedResource = await Like.findOne({
    [`${data?.resourceType}Id`]: data?.resourceId,
    // videoId: new Types.ObjectId("685c3886ea3c5de43a307519"),
    resourceType: data.resourceType,
    // videoId: "685c3886ea3c5de43a307519",
    likedBy: userId,
  });

  if (!foundLikedResource) {
    console.log("mei yaha hon");
    const updatedLikedDoc = await likeModel.create({
      [`${data?.resourceType}Id`]: data?.resourceId,
      likedBy: userId,
      type: data.type,
    });

    return {
      action: "updated",
      message: `given resource has been Liked`,
      data: updatedLikedDoc,
    };
    // create a new document
  }

  if (data.type === foundLikedResource.type) {
    // delete document
    const deletedLike = await likeModel.findByIdAndDelete(
      foundLikedResource._id
    );
    console.log(deletedLike);
    return {
      action: "deleted",
      message: `Like removed from the ${data?.resourceType}`,
    };
  }
  // modified old one  e
  // 1) either remove the document
  // or modified one
  const likedDoc = await likeModel.create({
    likedBy: userId,
    resourceId: data?.resourceId,
    type: data?.type,
    resourceType: data?.resourceType,
  });
  return {
    action: "created",
    message: `given resource has been Liked`,
    data: likedDoc,
  };
};

type ToggleResourceLikedParamsType = LikeResourceType & { resourceId: string };
export const toggleResourceLikeService = async (
  data: ToggleResourceLikedParamsType,
  userId: string
) => {
  if (!data?.resourceId || !isValidObjectId(data?.resourceId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid Resource ID", {
      errorCode: "ERR_INVALID_RESOURCE_ID",
    });
  }

  switch (data?.resourceType) {
    case "video":
      return await handleResourceLike(Video, VideoLike, data, userId);
    case "comment":
      return await handleResourceLike(Comment, CommentLike, data, userId);
    case "tweet":
      return await handleResourceLike(Tweet, TweetLike, data, userId);
    default:
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Invalid ResourceType is given",
        {
          errorCode: "ERR_BAD_REQUEST",
        }
      );
  }
};

export const getAllUserLikedVideos = async (userId: string) => {
  return await Like.aggregate([
    {
      $match: {
        likedBy: new Types.ObjectId(userId),
        resourceType: "video",
        type: "like",
      },
    },
    {
      $lookup: {
        from: "videos",
        foreignField: "_id",
        localField: "videoId",
        as: "videos",
        pipeline: [
          // get all the video likes and comments
          {
            $lookup: {
              from: "comments",
              foreignField: "videoId",
              localField: "_id",
              as: "comments",
            },
          },
          {
            $lookup: {
              from: "likes",
              foreignField: "videoId",
              localField: "_id",
              as: "likes",
            },
          },
          {
            $addFields: {
              likes: { $size: "$likes" },
              commentsCount: { $size: "$comments" },
            },
          },
        ],
      },
    },
    {
      $project: { videos: 1, _id: 0 },
    },
    { $unwind: "$videos" },
    { $replaceRoot: { newRoot: "$videos" } },
  ]);
};
