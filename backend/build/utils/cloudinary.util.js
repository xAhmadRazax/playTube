import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            throw new Error("localFilePath is required");
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        // console.log("File has been upload to cloudinary", response);
        return response;
    }
    catch (error) {
        console.log(error);
        // remove the temporary file as uploader operation got failed
        return null;
    }
    finally {
        await fs.unlink(localFilePath);
    }
};
class CloudinaryFileUploader {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }
    uploadImage = async (localFilePath, options = {}) => {
        try {
            if (!localFilePath) {
                throw new Error("localFilePath is required");
            }
            const response = await cloudinary.uploader.upload(localFilePath, options);
            return response;
        }
        catch (error) {
            // remove the temporary file as uploader operation got failed
            await fs.unlink(localFilePath);
            console.error("Cloudinary Upload Error:", error.message);
            throw error;
        }
    };
    async deleteImage(publicId) {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            return result;
        }
        catch (error) {
            console.error("Cloudinary Deletion Error:", error.message);
            throw error;
        }
    }
    generateImageUrl(publicId, options = {}) {
        try {
            return cloudinary.url(publicId, {
                secure: true,
                ...options,
            });
        }
        catch (error) {
            console.error("Cloudinary URL Generation Error:", error.message);
            throw error;
        }
    }
}
