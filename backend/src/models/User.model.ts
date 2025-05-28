import { Schema, model } from "mongoose";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserDocumentType, UserModelType } from "../types/userModel.type.js";
import { verifyAndDecodeJwtToken } from "../utils/jwtHandler.util.js";
import { AppErrorV4 } from "../utils/ApiError.util.js";
import { StatusCodes } from "http-status-codes";
import { UserSession } from "./UserSession.model.js";

const userSchema = new Schema<UserDocumentType, UserModelType>(
  {
    username: {
      type: String,
      required: [true, "Username is required."],
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
      minlength: [3, "Username must be at least 3 characters long."],
      maxlength: [50, "Username must not exceed 50 characters."],
    },
    fullName: {
      type: String,
      required: [true, "Full name is required."],
      trim: true,
      index: true,
      minlength: [3, "Full name must be at least 3 characters long."],
      maxlength: [50, "Full name must not exceed 50 characters."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      // Add regex for email format validation (optional but useful)
      match: [/\S+@\S+\.\S+/, "Please provide a valid email address."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      select: false,
      minlength: [6, "Password must be at least 6 characters long."],
    },
    avatar: {
      type: String,
      required: [true, "Avatar URL is required."],
    },
    coverImage: String,
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    refreshTokens: [String],
    passwordResetToken: String,
    passwordResetExpiry: Number,
    passwordChangedAt: Number,
  },
  {
    timestamps: true,
  }
);

// this only run when we save the doc with either create() or save() else wont run
userSchema.pre("save", async function (next): Promise<void> {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.methods.isPasswordCorrect = async function (
  candidatePassword: string
): Promise<boolean> {
  console.log(candidatePassword, this.password);
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
  if (!process.env.ACCESS_TOKEN_EXPIRY || !process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("JWT configuration missing");
  }
  return jwt.sign(
    {
      id: this.id || this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env
        .REFRESH_TOKEN_EXPIRY as jwt.SignOptions["expiresIn"],
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  if (!process.env.REFRESH_TOKEN_EXPIRY || !process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("JWT configuration missing");
  }

  return jwt.sign(
    {
      id: this.id || this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env
        .REFRESH_TOKEN_EXPIRY as jwt.SignOptions["expiresIn"],
    }
  );
};

userSchema.methods.hasPasswordChangedAfterJWTTokenIssued = function (
  this: UserDocumentType,
  tokenExpiry: number
): boolean {
  const jwtExpiryInMS = +tokenExpiry * 1000;

  if (this.passwordChangedAt) {
    return (jwtExpiryInMS >= this.passwordChangedAt) as boolean;
  }
  return false;
};
userSchema.methods.updateRefreshToken = async function (
  this: UserDocumentType,
  // tokenArr: string[],
  token: string,
  device: string,
  ip: string
  // removeTokenFlag: boolean = false
): Promise<void> {
  // if (removeTokenFlag) {
  //   this.refreshTokens = this?.refreshTokens?.filter(
  //     (rt: string) => rt !== token
  //   );
  // } else {
  //   this.refreshTokens = [...tokenArr, token];
  // }
  // await this.save({ validateBeforeSave: false });
  await UserSession.create({
    userId: this._id,
    refreshToken: token,
    deviceInfo: device,
    ipAddress: ip,
  });
};
export const User = model<UserDocumentType, UserModelType>("User", userSchema);
