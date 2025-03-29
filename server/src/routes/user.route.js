import express from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken,verifyRole } from "../services/auth.service.js";
const router = express.Router();

router.post("/", createUser);
router.put("/:id", updateUser);
router.get("/:id", getUserById);
router.get("/",verifyToken, getUsers);
router.delete("/:id", deleteUser);

export default router;
