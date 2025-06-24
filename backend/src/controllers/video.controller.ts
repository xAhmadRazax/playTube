import { Request, Response, NextFunction } from "express";
import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import {
  getVideoByIdService,
  publishVideoService,
  updateVideoService,
} from "../services/video.service.js";
import { ApiResponseV3 } from "../utils/ApiResponse.util.js";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/ApiError.util.js";
import { Multer } from "multer";
import { read } from "fs";
// import {Video} from "../models/video.model.js"
// import {User} from "../models/user.model.js"
// import {ApiError} from "../utils/ApiError.js"
// import {ApiResponse} from "../utils/ApiResponse.js"
// import {asyncHandler} from "../utils/asyncHandler.js"
// import {uploadOnCloudinary} from "../utils/cloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishVideo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, description } = req.body;
    const files = req.files as { [key: string]: Express.Multer.File[] };
    const videoData = {
      videoLocalPath: files.video[0]?.path,
      thumbnailLocalPath: files.thumbnail[0]?.path,
      title,
      description,
    };

    const video = await publishVideoService(req?.user?.id, videoData);

    ApiResponseV3.sendJSON(
      res,
      StatusCodes.CREATED,
      "Video published successfully",
      video
    );

    // TODO: get video, upload to cloudinary, create video
  }
);

const getVideoById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { videoId } = req.params;

    if (!videoId || !isValidObjectId(videoId)) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Invalid video ID", {
        errorCode: "ERR_INVALID_VIDEO_ID",
      });
    }

    const video = await getVideoByIdService(videoId);
    //TODO: get video by id

    ApiResponseV3.sendJSON(res, StatusCodes.OK, "Video fetched successfully", {
      video,
    });
  }
);

const updateVideo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { videoId } = req.params;
    const { title, description } = req.body;
    const data: {
      title?: string;
      description?: string;
      thumbnail?: string;
    } = {
      title,
      description,
    };
    if (req?.file?.fieldname === "thumbnail" && req?.file?.path) {
      data.thumbnail! = req?.file?.path;
    }
    if (!videoId || !isValidObjectId(videoId)) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Invalid video ID", {
        errorCode: "ERR_INVALID_VIDEO_ID",
      });
    }

    const updatedVideo = await updateVideoService(data, videoId, req?.user?.id);
    // so i need to do soemthing with the reqbody as it has the thngy like title description thumbnail
    // we wont allow user to change the fking video

    //TODO: update video details like title, description, thumbnail

    ApiResponseV3.sendJSON(res, StatusCodes.OK, "video updated successfully", {
      data: updatedVideo,
    });
  }
);

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId || !isValidObjectId(videoId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid video ID", {
      errorCode: "ERR_INVALID_VIDEO_ID",
    });
  }

  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
