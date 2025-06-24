import { StatusCodes } from "http-status-codes";
import { Video } from "../models/Video.model.js";
import { VideoDocumentType } from "../types/videoModel.type.js";
import { AppError } from "../utils/ApiError.util.js";
import { cloudinaryService } from "./cloudinary.service.js";
import { isValidObjectId, Types } from "mongoose";

export const publishVideoService = async (
  userId: string,
  videoData: {
    videoLocalPath: string;
    thumbnailLocalPath: string;
    title: string;
    description?: string;
  }
): Promise<VideoDocumentType> => {
  const batchPromises = [
    cloudinaryService.uploadLargeMedia(videoData.videoLocalPath, {
      folder: `${userId}/videos`,
    }),
    cloudinaryService.uploadMedia(videoData.thumbnailLocalPath, {
      folder: `${userId}/thumbnails`,
    }),
  ];

  // TODO: sicne im barhcing video if only one is failed other is save so i need to do what if video is loading but not thumbnail delete video vise versa
  const [uploadedVideo, uploadedThumbnail] = await Promise.all(batchPromises);

  console.log("Uploaded Video:", uploadedVideo);
  console.log("Uploaded Thumbnail:", uploadedThumbnail);
  const video = await Video.create({
    title: videoData.title,
    description: videoData.description || "",
    videoFile: uploadedVideo?.url,
    thumbnail: uploadedThumbnail?.url,
    owner: userId,
    duration: uploadedVideo?.duration || 0,
  });

  return video;
};

export const getVideoByIdService = async (videoId: string) => {
  const video = await Video.aggregate([
    {
      $match: { _id: new Types.ObjectId(videoId) },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              email: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "video",
        as: "comments",

        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
            },
          },
          {
            $project: {
              username: 1,
              email: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $addFields: {
        commentsCount: { $size: "$comments" },
        likesCount: { $size: "$likes" },
      },
    },
  ]);

  if (!video.length) {
    throw new AppError(StatusCodes.NOT_ACCEPTABLE, "Video not found", {
      errorCode: "ERR_VIDEO_NOT_FOUND",
    });
  }

  return video.at(0);
};

export const updateVideoService = async (
  data: {
    title?: string;
    description?: string;
    thumbnail?: string;
  },
  videoId: string,
  userId: string
) => {
  if (!videoId || !isValidObjectId(videoId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid video ID", {
      errorCode: "ERR_INVALID_VIDEO_ID",
    });
  }

  const dataToUpdate = { ...data };
  if (data.thumbnail) {
    const uploadedThumbnail = await cloudinaryService.uploadMedia(
      data.thumbnail,
      {
        folder: `${userId}/thumbnails`,
      }
    );

    data.thumbnail = uploadedThumbnail?.url;
  }

  let oldThumbnail: string = "";

  if (data.thumbnail) {
    const video = await Video.findById(videoId);
    if (video && video?.thumbnail) {
      oldThumbnail = video?.thumbnail;
    }
  }

  Object.keys(dataToUpdate).forEach((key) => {
    if (!dataToUpdate[key as keyof typeof dataToUpdate])
      delete dataToUpdate[key as keyof typeof dataToUpdate];
  });

  let updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: { ...data },
    },
    { new: true }
  );

  if (oldThumbnail) {
    await cloudinaryService.deleteMedia(
      "playTube" + oldThumbnail.split("/playTube")[1].split(".")[0],
      {
        invalidate: true,
      }
    );
  }

  return await Video.aggregate([
    {
      $match: { _id: new Types.ObjectId(videoId) },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              email: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "video",
        as: "comments",

        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
            },
          },
          {
            $project: {
              username: 1,
              email: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $addFields: {
        commentsCount: { $size: "$comments" },
        likesCount: { $size: "$likes" },
      },
    },
  ]);
  // this  one is tricky as we have a thumbnail updation init which in case
  // need data of the video

  //   const video = await Video.findById(videoId);
  //   if (!video) {
  //     throw new AppError(StatusCodes.NOT_FOUND, "No Video Found", {
  //       errorCode: "ERR_VIDEO_NOT_FOUND",
  //     });
  //   }

  //
};

export const deleteVideoService = async (videoId: string) => {
  if (!videoId || !isValidObjectId(videoId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid video ID", {
      errorCode: "ERR_INVALID_VIDEO_ID",
    });
  }
};
