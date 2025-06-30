import { Request, Response, NextFunction } from "express";
import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import {
  deleteVideoService,
  getAllVideosService,
  getVideoByIdService,
  publishVideoService,
  togglePublishStatusService,
  updateVideoService,
} from "../services/video.service.js";
import { ApiResponseV3 } from "../utils/apiResponse.util.js";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/apiError.util.js";

const getAllVideos = asyncHandler(async (req, res) => {
  // get all videos based on query, sort, pagination
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  const modifiedQuery = { ...req.query };
  if (modifiedQuery?.userId) {
    modifiedQuery.owner = req.query.userId;
    delete modifiedQuery.userId;
  }

  const videos = await getAllVideosService(req.query);
  ApiResponseV3.sendJSON(
    res,
    StatusCodes.OK,
    `${videos.length > 0 ? "Videos found successfully" : "No Video Found"}`,
    {
      data: videos,
    }
  );
});

const publishVideo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // get video, upload to cloudinary, create video

    const { title, description } = req.body;
    const files = req.files as { [key: string]: Express.Multer.File[] };
    console.log(files);
    const videoData = {
      video: files.video[0]?.path,
      thumbnail: files.thumbnail[0]?.path,
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
  }
);

const getVideoById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // get video by id

    const { videoId } = req.params;

    if (!videoId || !isValidObjectId(videoId)) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Invalid video ID", {
        errorCode: "ERR_INVALID_VIDEO_ID",
      });
    }

    const video = await getVideoByIdService(videoId);

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

    //TODO: update video details like title, description, thumbnail

    ApiResponseV3.sendJSON(res, StatusCodes.OK, "video updated successfully", {
      data: updatedVideo,
    });
  }
);

const deleteVideo = asyncHandler(async (req, res) => {
  // delete vide

  const { videoId } = req.params;
  if (!videoId || !isValidObjectId(videoId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid video ID", {
      errorCode: "ERR_INVALID_VIDEO_ID",
    });
  }
  await deleteVideoService(videoId);

  ApiResponseV3.sendJSON(res, StatusCodes.OK, "Video Deleted Successfully");
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { publishVideo } = req.body;

  const video = await togglePublishStatusService(videoId, publishVideo);

  ApiResponseV3.sendJSON(
    res,
    StatusCodes.OK,
    publishVideo
      ? "video Publish successfully"
      : "Video unpublish successfully",
    {
      data: video,
    }
  );
});

export {
  getAllVideos,
  publishVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
