import { Router } from "express";
import {
  createProject,
  getProjects,
  getProjectsByUserId,
  updateProject,
} from "../controllers/projects.controller";
import { isAuthenticated } from "../middleware/auth";
import upload from "../utils/uploader";

const router = Router();

// post routes
router.post(
  "/create", 
  isAuthenticated, 
  upload.fields([
    { name: "images", maxCount: 10 }, // For instruction images
    { name: "video", maxCount: 1 }    // For demo video
  ]), 
  createProject
);

// get routes
router.get("/", getProjects);
router.get("/get-user-projects", isAuthenticated, getProjectsByUserId);
router.get("/:id", isAuthenticated, getProjectsByUserId);

router.put(
  "/:id",
  isAuthenticated,
  upload.fields([{ name: "images" }, { name: "instructions" }]),
  updateProject
);

export default router;
