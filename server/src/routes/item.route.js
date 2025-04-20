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
  getItemsByShopId,
} from "../controllers/item.controller.js";
import { verifyToken } from "../services/auth.service.js";
const router = express.Router();

router.post("/", verifyToken, uploadImg.single("image"), createItem);

router.get("/", getItems);

router.get("/search", verifyToken, searchItems);

router.get("/:id", getItemById);

router.get("/shop/:shopId", getItemsByShopId);

router.put("/:id", verifyToken, uploadImg.single("image"), updateItem);

router.delete("/:id", verifyToken, deleteItem);

router.post("/:id/rate", verifyToken, rateItem);

router.post("/:id/upload-image", verifyToken, uploadImg.single("image"), uploadImage);

router.post("/:id/upload-video", verifyToken, uploadVid.single("video"), uploadVideo);

export default router;
