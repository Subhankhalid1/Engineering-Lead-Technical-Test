import multer from "multer";
import config from "../config/index.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.maxFileSizeMB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (config.supportedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
  },
});

export default upload;
