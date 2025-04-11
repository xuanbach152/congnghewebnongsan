import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../configs/cloudinary.config.js";

// Middleware cho image
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images", 
    allowed_formats: ["jpg", "png", "jpeg"], 
    transformation: [{ width: 500, height: 500, crop: "limit" }], 
  },
});

const uploadImg = multer({
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    console.log("Image file received:", JSON.stringify(file, null, 2));
    if (!file) {
      console.error("No image file received");
      return cb(new Error("No image file received"), false);
    }
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype)) {
      console.error("Invalid image file type");
      return cb(new Error("Invalid image file type"), false);
    }
    cb(null, true);
  },
});

// Middleware cho video
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "videos", 
resource_type: "video", 
    allowed_formats: ["mp4", "mpeg"], 
  },
});

const uploadVid = multer({
  storage: videoStorage,
  limits: { fileSize: 1000 * 1024* 1024 },
  fileFilter: (req, file, cb) => {
    console.log("Video file received:", JSON.stringify(file, null, 2));
    if (!file) {
      console.error("No video file received");
      return cb(new Error("No video file received"), false);
    }
    if (!["video/mp4", "video/mpeg"].includes(file.mimetype)) {
      console.error("Invalid video file type");
      return cb(new Error("Invalid video file type"), false);
    }
    cb(null, true);
  },
});

export { uploadImg, uploadVid };