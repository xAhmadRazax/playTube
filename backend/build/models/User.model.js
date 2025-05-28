import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserSession } from "./UserSession.model.js";
const userSchema = new Schema({
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
}, {
    timestamps: true,
});
// this only run when we save the doc with either create() or save() else wont run
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});
userSchema.methods.isPasswordCorrect = async function (candidatePassword) {
    console.log(candidatePassword, this.password);
    return await bcrypt.compare(candidatePassword, this.password);
};
userSchema.methods.generateAccessToken = function () {
    if (!process.env.ACCESS_TOKEN_EXPIRY || !process.env.ACCESS_TOKEN_SECRET) {
        throw new Error("JWT configuration missing");
    }
    return jwt.sign({
        id: this.id || this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName,
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env
            .REFRESH_TOKEN_EXPIRY,
    });
};
userSchema.methods.generateRefreshToken = function () {
    if (!process.env.REFRESH_TOKEN_EXPIRY || !process.env.REFRESH_TOKEN_SECRET) {
        throw new Error("JWT configuration missing");
    }
    return jwt.sign({
        id: this.id || this._id,
    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env
            .REFRESH_TOKEN_EXPIRY,
    });
};
userSchema.methods.hasPasswordChangedAfterJWTTokenIssued = function (tokenExpiry) {
    const jwtExpiryInMS = +tokenExpiry * 1000;
    if (this.passwordChangedAt) {
        return (jwtExpiryInMS >= this.passwordChangedAt);
    }
    return false;
};
userSchema.methods.updateRefreshToken = async function (
// tokenArr: string[],
token, device, ip
// removeTokenFlag: boolean = false
) {
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
export const User = model("User", userSchema);
