import crypto from "crypto";

import { Schema, model } from "mongoose";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserDocumentType, UserModelType } from "../types/userModel.type.js";
import { UserSession } from "./userSession.model.js";
import { string } from "zod";
import { generateRandomAvatarColor } from "../utils/general.util.js";

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
    // fullName: {
    //   type: String,
    //   required: [true, "Full name is required."],
    //   trim: true,
    //   index: true,
    //   minlength: [3, "Full name must be at least 3 characters long."],
    //   maxlength: [50, "Full name must not exceed 50 characters."],
    // },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
      required: [true, "Gender is required"],
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
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
      // required: [true, "Avatar URL is required."],
    },
    avatarColor: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    accountStatus: {
      type: String,
      enum: ["active", "suspended", "banned"],
      default: "active",
    },
    monetizationStatus: {
      type: String,
      enum: ["eligible", "not_eligible", "pending_review", "rejected"],
      default: "not_eligible",
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
    passwordResetExpiry: Date,
    passwordChangedAt: Number,
    emailVerificationToken: String,
    emailVerificationExpires: Date,
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        delete ret.password;
        delete ret.__v;
        if ("passwordResetToken" in ret) delete ret.passwordResetToken;
        if ("passwordResetExpiry" in ret) delete ret.passwordResetExpiry;
        if ("passwordChangedAt" in ret) delete ret.passwordChangedAt;
        if ("refreshTokens" in ret) delete ret.refreshTokens;
        if ("createdAt" in ret) delete ret.createdAt;
        if ("updatedAt" in ret) delete ret.updatedAt;
      },
    },
  }
);

userSchema.pre("save", async function (next): Promise<void> {
  if (!this.isNew) return next();

  this.avatarColor = generateRandomAvatarColor();
  next();
});

userSchema.pre("save", async function (next): Promise<void> {
  if (!this.isModified("password") || this.isNew) return next();

  // saving changes in db takes time so we are just gona remove 1s from the changes time
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

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
    return (this.passwordChangedAt >= jwtExpiryInMS) as boolean;
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

userSchema.methods.generateVerifyToken = function (this: UserDocumentType) {
  const token = User.generateCryptoToken();
  const encryptedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.emailVerificationToken = encryptedToken;
  this.emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000);
  return token;
};
userSchema.methods.generatePasswordResetToken = function (
  this: UserDocumentType
) {
  const token = User.generateCryptoToken();
  const encryptedToken = User.encryptCryptoToken(token);
  this.passwordResetToken = encryptedToken;
  this.passwordResetExpiry = new Date(Date.now() + 60 * 60 * 1000);
  return token;
};
userSchema.methods.isPasswordResetTokenValid = function (
  this: UserDocumentType
) {
  if (
    this?.passwordResetExpiry &&
    new Date(this.passwordResetExpiry).getTime() < Date.now()
  ) {
    return false;
  }
  return true;
};
// static methods

userSchema.statics.generateCryptoToken = function (): string {
  return crypto.randomBytes(32).toString("hex");
};
userSchema.statics.encryptCryptoToken = function (
  token: string,
  algo:
    | "md5"
    | "sha1"
    | "sha224"
    | "sha256"
    | "sha384"
    | "sha512"
    | "sha3-224"
    | "sha3-256"
    | "sha3-384"
    | "sha3-512"
    | "ripemd160"
    | "blake2b512"
    | "blake2s256" = "sha256"
) {
  return crypto.createHash(algo).update(token).digest("hex");
};
export const User = model<UserDocumentType, UserModelType>("User", userSchema);
