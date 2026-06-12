import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { FILE_CONSTRAINTS } from "../utils/constants.js";
import AppError from "../utils/AppError.js";

/**
 * Setup Cloudinary storage for Multer
 * Files are uploaded directly to Cloudinary without saving locally
 */
const createCloudinaryStorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `careerpilot-ai/${folder}`,
      resource_type: "auto",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf", "doc", "docx"],
    },
  });
};

/**
 * Multer instance for profile pictures
 */
export const uploadProfile = multer({
  storage: createCloudinaryStorage("profile-pictures"),
  limits: { fileSize: FILE_CONSTRAINTS.MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (FILE_CONSTRAINTS.ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError("Only image files are allowed", 400));
    }
  },
});

/**
 * Multer instance for resume/CV uploads
 */
export const uploadResume = multer({
  storage: createCloudinaryStorage("resumes"),
  limits: { fileSize: FILE_CONSTRAINTS.MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (FILE_CONSTRAINTS.ALLOWED_RESUME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError("Only PDF and DOCX files up to 5MB are allowed.", 400));
    }
  },
});

/**
 * Multer instance for generic file uploads
 */
export const uploadMultiple = multer({
  storage: createCloudinaryStorage("files"),
  limits: { fileSize: FILE_CONSTRAINTS.MAX_FILE_SIZE },
});

/**
 * Delete a file from Cloudinary by public ID
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new AppError(`Failed to delete file from Cloudinary: ${error.message}`, 500);
  }
};
