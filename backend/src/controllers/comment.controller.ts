// import mongoose from "mongoose"
// import {Comment} from "../models/comment.model.js"
// import {ApiError} from "../utils/ApiError.js"
// import {ApiResponse} from "../utils/ApiResponse.js"
// import {asyncHandler} from "../utils/asyncHandler.js"

// const getVideoComments = asyncHandler(async (req, res) => {
//     //TODO: get all comments for a video
//     const {videoId} = req.params
//     const {page = 1, limit = 10} = req.query

// })

// const addComment = asyncHandler(async (req, res) => {
//     // TODO: add a comment to a video
// })

// const updateComment = asyncHandler(async (req, res) => {
//     // TODO: update a comment
// })

// const deleteComment = asyncHandler(async (req, res) => {
//     // TODO: delete a comment
// })

// export {
//     getVideoComments,
//     addComment,
//     updateComment,
//      deleteComment
//     }

import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { Comment } from "../models/comment.model.js";
import { ApiResponseV3 } from "../utils/apiResponse.util.js";
export const createComment = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { resourceType, content, resourceId } = req.body;
    await Comment.create({
      owner: userId,
      resource: {
        // kind: `${resourceType.at(0).toUpperCase()}${resourceType.slice(1).toLowerCase()}`,
        kind: "Video",
        item: resourceId,
      },
      content,
    });
    ApiResponseV3.sendJSON(res, 201, "Comment created");
  }
);
