import { Schema, model } from "mongoose";
import { parseTimeToMs } from "../utils/parseTimeToMS.util.js";
const blacklistSchema = new Schema({
    token: {
        type: String,
        required: [true, "Token is required."],
        trim: true,
    },
    expireAt: {
        type: Date,
        // default: Date.now() + parseTimeToMs(process.env.REFRESH_TOKEN_EXPIRY),
        default: Date.now() + parseTimeToMs("5m"),
        // required: [true, "Token expiry is required"],
    },
});
// this will cause TTL (time-to-live) monitor run every seconds and checks if a document needs to be
// deleted so  there might be some delays
blacklistSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
export const BlacklistModel = model("Blacklist", blacklistSchema);
