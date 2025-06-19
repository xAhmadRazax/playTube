import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from "cloudinary";
import fs from "fs/promises";

class CloudinaryFileUploader {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  uploadImage = async (
    localFilePath: string,
    options: UploadApiOptions
  ): Promise<UploadApiResponse> => {
    try {
      if (!localFilePath) {
        throw new Error("localFilePath is required");
      }
      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
        ...options,
        folder: options?.folder ? `playTube/${options.folder}` : "playTube", // default folder
      });

      return response;
    } catch (error) {
      // remove the temporary file as uploader operation got failed

      console.error("Cloudinary Upload Error:", (error as Error).message);
      throw error;
    } finally {
      await fs.unlink(localFilePath);
    }
  };
  async deleteImage(publicId: string, options = {}) {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        invalidate: true,
        ...options,
      });
      return result;
    } catch (error) {
      console.error("Cloudinary Deletion Error:", (error as Error).message);
      throw error;
    }
  }
  generateImageUrl(publicId: string, options = {}) {
    try {
      return cloudinary.url(publicId, {
        secure: true,
        ...options,
      });
    } catch (error) {
      console.error(
        "Cloudinary URL Generation Error:",
        (error as Error).message
      );
      throw error;
    }
  }
}

export const cloudinaryService = new CloudinaryFileUploader();
