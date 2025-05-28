// import { Request, Response } from "express";
// import { asyncHandler } from "../utils/asyncHandler.util.js";
// import { ApiResponseV3 } from "../utils/ApiResponse.util.js";
// import { UserSchema } from "../schemas/user.schema.js";
// import { UserSchemaType } from "../types/userModel.type.js";
// import { StatusCodes } from "http-status-codes";
// import { User } from "../models/User.model.js";
// import { uploadOnCloudinary } from "../utils/cloudinary.util.js";

// export const registerUser = asyncHandler(
//   async (req: Request, res: Response): Promise<void> => {
//     // get data from frontend
//     // validate them
//     // check if user already exists : email, username
//     // check for images, check for avatar
//     // upload them to cloudinary, avatar
//     // create user object

//     // store data in db, remove password and token field
//     // return it
//     // checking if user input validate our zodSchema
//     const files = req.files as { [key: string]: Express.Multer.File[] };

//     const avatarLocalPath =
//       files?.avatar?.length > 0 ? files?.avatar[0]?.path : null;
//     const coverImageLocalPath =
//       files?.coverImage?.length > 0 ? files?.coverImage[0]?.path : null;

//     const { username, fullName, email, password } = req.body;

//     const user = await User.create({
//       username: username.toLowerCase(),
//       fullName,
//       email,
//       password,
//       // avatar: avatar?.url,
//       avatar: avatarLocalPath,
//       // coverImage: coverImage?.url || null,
//       coverImage: coverImageLocalPath || null,
//     });
//     const avatar = await uploadOnCloudinary(avatarLocalPath!);
//     let coverImage;
//     if (coverImageLocalPath) {
//       coverImage = await uploadOnCloudinary(coverImageLocalPath);
//     }
//     user.avatar = avatar?.url || "";
//     user.coverImage = coverImage?.url || "";

//     user.save();

//     ApiResponseV3.sendJSON(
//       res,
//       StatusCodes.CREATED,
//       "User created successfully.",
//       user
//     );
//   }
// );
