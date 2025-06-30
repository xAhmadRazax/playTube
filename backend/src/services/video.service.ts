import { StatusCodes } from "http-status-codes";
import { Video } from "../models/video.model.js";
import { VideoDocumentType } from "../types/videoModel.type.js";
import { AppError } from "../utils/apiError.util.js";
import { cloudinaryService } from "./cloudinary.service.js";
import { isValidObjectId, Types } from "mongoose";
import { DeleteApiResponse, UploadApiResponse } from "cloudinary";
import { ParsedQs } from "qs";
import { ApiFeatures } from "../utils/apiFeatures.js";
import { formatDurationFromSecondsToMinutes } from "../utils/general.util.js";
import { updateVideoType, VideoPublishType } from "../schemas/video.schema.js";
export const getAllVideosService = async (
  queryObj: ParsedQs
): Promise<VideoDocumentType[]> => {
  const featuredQuery = new ApiFeatures(Video.find(), queryObj)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const videos = await featuredQuery.queryBuilder;

  return videos;
};

export const publishVideoService = async (
  userId: string,
  videoData: VideoPublishType
): Promise<VideoDocumentType> => {
  const batchPromises = [
    cloudinaryService.uploadLargeMedia(videoData.video, {
      folder: `${userId}/videos`,
    }),
    cloudinaryService.uploadMedia(videoData.thumbnail, {
      folder: `${userId}/thumbnails`,
    }),
  ];

  let batchPromisesResult: PromiseSettledResult<UploadApiResponse>[] =
    await Promise.allSettled(batchPromises);

  const successfulUploads: UploadApiResponse[] = [];
  const failedUploads: { error: any }[] = [];

  batchPromisesResult.forEach((r) => {
    if (r && r.status === "rejected") {
      failedUploads.push({ error: r.reason });
    }
    if (r.status === "fulfilled") {
      successfulUploads.push(r.value);
    }
  });
  // cleaning up incase of some resource gave error duo to some issue from cloudinary

  if (failedUploads.length > 0) {
    // delete items from the cloudinary server

    await Promise.all(
      successfulUploads.map((rp) => cloudinaryService.deleteMedia(rp.url))
    );
    // throw errors
    const isFileTooBig = failedUploads.some(
      (rp) => rp.error?.http_code === 413
    );

    if (isFileTooBig) {
      throw new AppError(
        StatusCodes.REQUEST_TOO_LONG,
        "One of the file is too long",
        {
          errorCode: "ERR_CLOUDINARY_FILE_TOO_LONG",
        }
      );
    } else {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Something went wrong",
        { errorCode: "ERR_INTERNAL_SERVER" }
      );
    }
  }
  const [uploadedVideo, uploadedThumbnail] = successfulUploads;

  const video = await Video.create({
    title: videoData.title,
    description: videoData?.description || "",
    videoFile: uploadedVideo?.url,
    thumbnail: uploadedThumbnail?.url,
    duration: formatDurationFromSecondsToMinutes(uploadedVideo?.duration || 0),
    owner: userId,
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
  data: updateVideoType,

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
    await cloudinaryService.deleteMedia(oldThumbnail, {
      invalidate: true,
    });
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

  const deletedVideo = await Video.findByIdAndDelete(videoId);

  if (deletedVideo) {
    const batchArr: Promise<DeleteApiResponse>[] = [
      cloudinaryService.deleteMedia(deletedVideo!.videoFile),
    ];
    if (deletedVideo && deletedVideo?.thumbnail) {
      batchArr.push(cloudinaryService.deleteMedia(deletedVideo!.thumbnail));
    }

    await Promise.all(batchArr);
  }
  return deletedVideo;
};
export const togglePublishStatusService = async (
  videoId: string,
  publish: boolean
) => {
  if (!videoId || !isValidObjectId(videoId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid video ID", {
      errorCode: "ERR_INVALID_VIDEO_ID",
    });
  }

  await Video.findByIdAndUpdate(videoId, {
    $set: {
      isPublished: publish,
    },
  });

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
};
