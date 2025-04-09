import express from "express";
import { uploadImg, uploadVid } from "../utils/upload.middleware.js";
import {
    createItem,
    getItems,
    getItemById,
    getItemByShopId,
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

router.get("/items/:shopId", getItemByShopId);

router.put("/:id", updateItem);

router.delete("/:id", deleteItem);

router.post("/:id/rate", rateItem);

router.post("/:id/upload-image", uploadImg.single("image"), uploadImage);

router.post("/:id/upload-video", uploadVid.single("video"), uploadVideo);

export default router;