import fs from "fs";
import { UploadApiResponse } from "cloudinary";
import { cloudinaryService } from "./cloudinary.service.js";
import { Tweet } from "../models/tweet.model.js";
import { AppError } from "../utils/apiError.util.js";
import { StatusCodes } from "http-status-codes";
import { isValidObjectId, Types } from "mongoose";
import { ApiFeatures } from "../utils/apiFeatures.js";
import { ParsedQs } from "qs";

export const getTweetService = async (queryObj: ParsedQs) => {
  // add filters here to get the items based on query
  const featuredQuery = new ApiFeatures(Tweet.find(), queryObj)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tweets = await featuredQuery.queryBuilder;

  return tweets;
};

export const getTweetByIdService = async (tweetId: string) => {
  if (!tweetId || !isValidObjectId(tweetId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid tweet ID", {
      errorCode: "ERR_INVALID_TWEET_ID",
    });
  }
  // use aggregate pipeline to get the data about tweet such as comments and like

  // what i want to do here
  // get the tweet
  // get the comments associate  with it
  // get the likes that are associate with it
  const tweet = await Tweet.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(tweetId),
      },
    },
    // getting comments associate with tweet
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $lookup: {
        from: "comments",
        // localField: "",
        // foreignField: "",
        as: "comments",
        let: { tweetId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$resource.kind", "Comment"] },
                  { $eq: ["$resource.item", "$$tweetId"] },
                ],
              },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [],
            },
          },
          { $sort: { createdAt: -1 } },

          {
            $project: {
              content: 1,
              createdAt: 1,
              updatedAt: 1,
              owner: 1,
            },
          },
        ],
      },
    },
    // getting likes associate with tweet
    {
      $lookup: {
        from: "likes",
        foreignField: "tweetId",
        localField: "_id",
        as: "likes",
        // pipeline: [],
      },
    },
    {
      $addFields: {
        commentsCount: { $size: "$comments" },
        likesCount: { $size: "$likes" },
      },
    },
  ]);

  if (!tweet.length) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Tweet not found", {
      errorCode: "ERR_Tweet_NOT_FOUND",
    });
  }

  return tweet.at(0);
};
export const getUserTweetsServices = async (userId: string) => {
  if (!userId || isValidObjectId(userId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid user ID", {
      errorCode: "ERR_INVALID_USER_ID",
    });
  }

  const tweets = await Tweet.aggregate([
    {
      $match: {
        owner: new Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $lookup: {
        from: "comments",
        // localField: "",
        // foreignField: "",
        as: "comments",
        let: { tweetId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$resource.kind", "Comment"] },
                  { $eq: ["$resource.item", "$$tweetId"] },
                ],
              },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [],
            },
          },
          { $sort: { createdAt: -1 } },

          {
            $project: {
              content: 1,
              createdAt: 1,
              updatedAt: 1,
              owner: 1,
            },
          },
        ],
      },
    },
    // getting likes associate with tweet
    {
      $lookup: {
        from: "likes",
        foreignField: "tweetId",
        localField: "_id",
        as: "likes",
        // pipeline: [],
      },
    },
    {
      $addFields: {
        commentsCount: { $size: "$comments" },
        likesCount: { $size: "$likes" },
      },
    },
  ]);

  return tweets;
};

export const createTweetService = async (
  data: {
    content: string;
    coverImage?: string;
  },
  userId: string
) => {
  const { content, coverImage } = data;
  if (!content) {
    throw new AppError(StatusCodes.BAD_REQUEST, "content is missing.", {
      errorCode: "ERR_BAD_REQUEST",
    });
  }

  let cloudinaryCoverImagePath: UploadApiResponse | null = null;
  try {
    if (coverImage) {
      cloudinaryCoverImagePath = await cloudinaryService.uploadMedia(
        coverImage,
        {
          folder: `${userId}/tweets`,
        }
      );
    }

    const tweet = await Tweet.create({
      owner: userId,
      content,
      coverImage: cloudinaryCoverImagePath
        ? cloudinaryCoverImagePath?.url
        : null,
    });
    return tweet;
  } catch (error) {
    if (data.coverImage && fs.existsSync(data?.coverImage)) {
      try {
        fs.unlinkSync(data.coverImage);
      } catch (error) {
        console.error(`Failed to delete local file ${coverImage}:`, error);
      }
      if (cloudinaryCoverImagePath) {
        await cloudinaryService.deleteMedia(cloudinaryCoverImagePath.url);
      }
    }
    throw error;
  }
};

export const updateTweetService = async (
  data: {
    tweetId: string;
    content: string;
    coverImage?: string;
  },
  userId: string
) => {
  const { content, coverImage, tweetId } = data;
  // checking if the id is valid
  if (!tweetId || !isValidObjectId(tweetId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid tweet ID", {
      errorCode: "ERR_INVALID_TWEET_ID",
    });
  }

  // finding the tweet with the given id
  const existedTweet = await Tweet.findById(tweetId);
  if (!existedTweet) {
    throw new AppError(StatusCodes.NOT_FOUND, "Invalid Tweet Id", {
      errorCode: "ERR_INVALID_TWEET_ID",
    });
  }
  let cloudinaryCoverImagePath: UploadApiResponse | null = null;
  let oldCoverImage: string = existedTweet?.coverImage;

  try {
    if (coverImage) {
      cloudinaryCoverImagePath = await cloudinaryService.uploadMedia(
        coverImage,
        {
          folder: `${userId}/tweets`,
        }
      );
    }
    const updatedData: { content?: string; coverImage?: string } = {};
    if (content) {
      updatedData.content = content;
    }
    if (coverImage && cloudinaryCoverImagePath) {
      updatedData.coverImage = cloudinaryCoverImagePath.url;
    }
    const updatedTweet = await Tweet.findByIdAndUpdate(tweetId, updatedData, {
      new: true,
    });
    if (!updatedTweet) {
      throw new AppError(StatusCodes.NOT_FOUND, "Tweet update failed", {
        errorCode: "ERR_UPDATE_FAILED",
      });
    }
    if (cloudinaryCoverImagePath && cloudinaryCoverImagePath.url) {
      await cloudinaryService.deleteMedia(oldCoverImage);
    }

    return updatedTweet;
  } catch (error) {
    if (data.coverImage && fs.existsSync(data?.coverImage)) {
      try {
        fs.unlinkSync(data.coverImage);
      } catch (error) {
        console.error(`Failed to delete local file ${coverImage}:`, error);
      }
      if (cloudinaryCoverImagePath) {
        await cloudinaryService.deleteMedia(cloudinaryCoverImagePath.url);
      }
    }
    throw error;
  }
};

export const removeTweetCoverImageService = async (tweetId: string) => {
  if (!tweetId || !isValidObjectId(tweetId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid tweet ID", {
      errorCode: "ERR_INVALID_TWEET_ID",
    });
  }

  const tweetExists = await Tweet.findById(tweetId);

  if (!tweetExists) {
    throw new AppError(StatusCodes.NOT_FOUND, "Invalid Tweet Id", {
      errorCode: "ERR_INVALID_TWEET_ID",
    });
  }

  if (tweetExists?.coverImage) {
    await cloudinaryService.deleteMedia(tweetExists.coverImage);
  }
  return await Tweet.findByIdAndUpdate(
    tweetId,
    { coverImage: null },
    { new: true }
  );
};

export const deleteTweetService = async (tweetId: string) => {
  if (!tweetId || !isValidObjectId(tweetId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid tweet ID", {
      errorCode: "ERR_INVALID_TWEET_ID",
    });
  }

  await Tweet.findByIdAndDelete(tweetId);
};
