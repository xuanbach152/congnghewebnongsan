import express from "express";
import { uploadImg, uploadVid } from "../utils/upload.middleware.js";
import {
  createItem,
  getItems,
  getItemById,
  searchItems,
  updateItem,
  deleteItem,
  rateItem,
  uploadImage,
  uploadVideo,
} from "../controllers/item.controller.js";

const router = express.Router();

router.post("/", createItem);

router.get("/", getItems);

router.get("/search", searchItems);

router.get("/:id", getItemById);

router.put("/:id", updateItem);

router.delete("/:id", deleteItem);

router.post("/:id/rate", rateItem);

router.post("/:id/upload-image", uploadImg.single("image"), uploadImage);

router.post("/:id/upload-video", uploadVid.single("video"), uploadVideo);

<<<<<<< HEAD
export default router;
=======
export default router;
>>>>>>> origin/main
