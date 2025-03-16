import express from "express";
import { createUser, deleteUserById, getUserById, getUsers, updateUser } from "../controllers/user.controller.js";
const router = express.Router();

router.post("/create", createUser);
router.post("/update/:id", updateUser);
router.get("/:id", getUserById);
router.get("", getUsers);
router.delete("/:id", deleteUserById);

export default router;
