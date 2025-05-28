import { Schema, model } from "mongoose";
import { parseTimeToMs } from "../utils/parseTimeToMS.util.js";
const userSessionSchema = new Schema({
    userId: {
        type: Schema.ObjectId,
        ref: "User",
    },
    refreshToken: {
        type: String,
        trim: true,
        required: [true, "refresh token is required"],
    },
    deviceInfo: String,
    ipAddress: String,
    expireAt: {
        type: Number,
        default: Date.now() + parseTimeToMs(process.env.REFRESH_TOKEN_EXPIRY),
        //   default: Date.now() + parseTimeToMs("5m"),
        required: [true, "Token expiry is required"],
    },
}, { timestamps: true });
userSessionSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
export const UserSession = model("Session", userSessionSchema);
