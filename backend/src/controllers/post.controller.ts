import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.util.js";
enum ResourceType {
  Video = "video",
  Blog = "blog",
  Tweet = "tweet",
  Quiz = "quiz",
}
export const createTweet = asyncHandler(async (req: Request, res: Response) => {
  const { content } = req.body;

  console.log(req.files);

  //
});
