import express from "express";
import {
    register,
   login,
    logout,
    requestrefresh_token
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register",register );
router.post("/login",login); 
router.post("/logout",  logout);
router.post("/refresh_token", requestrefresh_token);
export default router;
