import { join } from "path";
import multer from "multer";

import { __dirname } from "../utils/__dirname.util.js";
console.log(__dirname);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, join(__dirname, "..", "..", "public", "temp"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });
