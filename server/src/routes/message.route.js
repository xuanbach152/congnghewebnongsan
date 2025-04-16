import express from "express";
import {getMessages, saveMessage} from "../controllers/message.controller.js";
import {verifyToken} from "../services/auth.service.js";
const router = express.Router();

router.get("/:receiverId",  getMessages);
router.post("/:receiverId", verifyToken, saveMessage);

export default router;