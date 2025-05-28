import { ZodError } from "zod";
import fs from "fs";
export const validationAndFileCleanupHandler = (schema) => (req, res, next) => {
    const files = req?.files;
    const avatarLocalPath = files?.avatar?.length > 0 ? files.avatar[0].path : null;
    const coverImageLocalPath = files?.coverImage?.length > 0 ? files.avatar[0].path : null;
    try {
        console.log(avatarLocalPath, coverImageLocalPath);
        schema.parse({ ...req.body, avatar: avatarLocalPath || undefined });
        next();
    }
    catch (error) {
        if (error instanceof ZodError) {
            if (avatarLocalPath)
                fs.unlinkSync(avatarLocalPath);
            if (coverImageLocalPath)
                fs.unlinkSync(coverImageLocalPath);
        }
        next(error);
    }
};
