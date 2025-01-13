import { Router } from "express";
import {
	register,
	login,
	logout,
	getUserDetails,
	activateUser,
	refreshToken,
} from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth";
import upload from "../utils/uploader";

const router = Router();

// post routes
router.post("/register", upload.single("avatar"), register);
router.post("/activate-user", activateUser);
router.post("/", login);

// delete routes
router.post("/logout", isAuthenticated, logout);

// get routes
router.get("/me", isAuthenticated, getUserDetails);
router.get("/refresh-token", isAuthenticated, refreshToken);

export default router;
