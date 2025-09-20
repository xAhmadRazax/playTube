import fs from "fs/promises";

import { cloudinaryService } from "../services/cloudinary.service.js";

export const cleanupMedia = async ({
  remoteUrls = [],
  localPaths = [],
}: {
  remoteUrls?: string[];
  localPaths?: string[];
}) => {
  try {
    for (const url of remoteUrls) {
      await cloudinaryService.deleteMedia(url);
    }
    for (const path of localPaths) {
      await safeDeleteLocalFile(path);
    }
  } catch (error) {
    console.error("Failed during media cleanup:", error);
  }
};
async function safeDeleteLocalFile(path: string) {
  try {
    await fs.unlink(path);
  } catch (err) {
    console.error(`Failed to delete file ${path}:`, err);
  }
}
