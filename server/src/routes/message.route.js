import express from "express";
import {
  createMessage,
  updateMessage,
  getMessages,
  getMessagesByChatBox,
  getMessageById,
  deleteMessageById,
} from "../controllers/message.controller.js";
import { verifyToken } from "../services/auth.service.js";

const router = express.Router();

router.get("/", verifyToken, getMessages);
router.get("/chat", verifyToken, getMessagesByChatBox);
router.get("/:id", verifyToken, getMessageById);
router.post("/create", verifyToken, createMessage);
router.patch("/update/:id", verifyToken, updateMessage);
router.delete("/:id", verifyToken, deleteMessageById);

export default router;
