// import mongoose, {isValidObjectId} from "mongoose"
// import {Like} from "../models/like.model.js"
// import {ApiError} from "../utils/ApiError.js"
// import {ApiResponse} from "../utils/ApiResponse.js"
// import {asyncHandler} from "../utils/asyncHandler.js"

// const toggleVideoLike = asyncHandler(async (req, res) => {
//     const {videoId} = req.params
//     //TODO: toggle like on video
// })

// const toggleCommentLike = asyncHandler(async (req, res) => {
//     const {commentId} = req.params
//     //TODO: toggle like on comment

// })

// const toggleTweetLike = asyncHandler(async (req, res) => {
//     const {tweetId} = req.params
//     //TODO: toggle like on tweet
// }
// )

// const getLikedVideos = asyncHandler(async (req, res) => {
//     //TODO: get all liked videos
// })

// export {
//     toggleCommentLike,
//     toggleTweetLike,
//     toggleVideoLike,
//     getLikedVideos
// }
import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { AppError } from "../utils/apiError.util.js";
import { StatusCodes } from "http-status-codes";
import { ApiResponseV3 } from "../utils/apiResponse.util.js";
import {
  toggleResourceLikeService,
  getAllUserLikedVideos,
} from "../services/like.service.js";

export const toggleResourceLike = asyncHandler(async (req, res) => {
  const { id } = req.params;

  console.log(id, "id");
  if (!id || !isValidObjectId(id)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid resource ID", {
      errorCode: "ERR_INVALID_RESOURCE_ID",
    });
  }

  const { resourceType, type } = req.body;
  //TODO: toggle like on video

  const toggleLikedResponse = await toggleResourceLikeService(
    { resourceId: id, resourceType, type },
    req?.user?.id
  );

  const statusCode =
    toggleLikedResponse?.action === "created"
      ? StatusCodes.CREATED
      : StatusCodes.OK;
  ApiResponseV3.sendJSON(res, statusCode, toggleLikedResponse.message, {
    data: toggleLikedResponse?.data,
  });
});

export const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos

  const documents = await getAllUserLikedVideos(req?.user?._id);

  ApiResponseV3.sendJSON(
    res,
    StatusCodes.OK,
    documents?.length > 0
      ? "Fetched liked videos successfully."
      : "No liked videos found.",
    {
      count: documents.length,
      data: documents,
    }
  );
});
