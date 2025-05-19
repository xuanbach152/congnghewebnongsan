import express from "express";
import {
  createChatBox,
  getChatBoxesByUserId,
  getChatBoxById,
  deleteChatBoxById,
} from "../controllers/chatBox.controller.js";
import { verifyToken } from "../services/auth.service.js";

const router = express.Router();

router.post("/create", verifyToken, createChatBox);
router.get("/user", verifyToken, getChatBoxesByUserId);
router.get("/:id", getChatBoxById);
router.delete("/:id", deleteChatBoxById);

export default router;
