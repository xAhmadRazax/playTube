import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import {
  createTweetService,
  deleteTweetService,
  getTweetByIdService,
  getUserTweetsServices,
  updateTweetService,
} from "../services/tweet.service.js";
import { ApiResponseV3 } from "../utils/apiResponse.util.js";
import { StatusCodes } from "http-status-codes";
import { isValidObjectId } from "mongoose";
import { AppError } from "../utils/apiError.util.js";

export const createTweet = asyncHandler(async (req: Request, res: Response) => {
  //TODO: create tweet
  const files = req.files as { [key: string]: Express.Multer.File[] };
  const { content } = req.body;
  const tweet = await createTweetService(
    { content, coverImage: files?.coverImage[0].path },
    req.user.id
  );

  ApiResponseV3.sendJSON(
    res,
    StatusCodes.CREATED,
    "tweet created Successfully",
    { data: tweet }
  );
});

export const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets

  const { userId } = req.params;

  if (!userId || isValidObjectId(userId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid user ID", {
      errorCode: "ERR_INVALID_USER_ID",
    });
  }

  const tweets = await getUserTweetsServices(userId);

  ApiResponseV3.sendJSON(
    res,
    StatusCodes.OK,
    `${tweets.length > 0 ? "Tweets Found Successfully" : "No Tweets founds"}`,
    {
      data: {
        length: tweets.length,
        tweets,
      },
    }
  );
});

export const getTweetById = asyncHandler(async (req, res) => {
  // TODO: get user tweets

  const { tweetId } = req.params;
  if (!tweetId || isValidObjectId(tweetId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid tweet ID", {
      errorCode: "ERR_INVALID_TWEET_ID",
    });
  }

  const tweet = await getTweetByIdService(tweetId);

  ApiResponseV3.sendJSON(res, StatusCodes.OK, "Tweets Found Successfully", {
    data: {
      tweet,
    },
  });
});

export const updateTweet = asyncHandler(async (req: Request, res: Response) => {
  //TODO: update tweet
  const { tweetId } = req.params;
  if (!tweetId || isValidObjectId(tweetId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid tweet ID", {
      errorCode: "ERR_INVALID_TWEET_ID",
    });
  }
  const files = req.files as { [key: string]: Express.Multer.File[] };
  const { content } = req.body;

  if (!content && !files?.coverImage[0].path) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "both the enter either one of the following or both (content, coverImage)",
      {
        errorCode: "ERR_BAD_REQUEST",
      }
    );
  }
  const updatedTweet = await updateTweetService(
    {
      tweetId,
      content,
      coverImage: files?.coverImage[0].path,
    },
    req?.user?.id
  );

  ApiResponseV3.sendJSON(res, StatusCodes.OK, "Tweet Updated Successfully", {
    data: updatedTweet,
  });
});

export const deleteTweet = asyncHandler(async (req: Request, res: Response) => {
  //TODO: delete tweet
  const { tweetId } = req.params;
  if (!tweetId || isValidObjectId(tweetId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid tweet ID", {
      errorCode: "ERR_INVALID_TWEET_ID",
    });
  }
  await deleteTweetService(tweetId);

  ApiResponseV3.sendJSON(res, StatusCodes.OK, "Tweet Deleted Successfully");
});
