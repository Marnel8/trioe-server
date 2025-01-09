"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projects_controller_1 = require("../controllers/projects.controller");
const auth_1 = require("../middleware/auth");
const uploader_1 = __importDefault(require("../utils/uploader"));
const router = (0, express_1.Router)();
// post routes
router.post("/create", auth_1.isAuthenticated, uploader_1.default.fields([
    { name: "images", maxCount: 10 }, // For instruction images
    { name: "video", maxCount: 1 }, // For demo video
]), projects_controller_1.createProject);
// get routes
router.get("/", projects_controller_1.getProjects);
router.get("/get-user-projects", auth_1.isAuthenticated, projects_controller_1.getProjectsByUserId);
router.get("/:id", projects_controller_1.getProjectById);
router.put("/:id", auth_1.isAuthenticated, uploader_1.default.fields([
    { name: "images", maxCount: 10 }, // For instruction images
    { name: "video", maxCount: 1 }, // For demo video
]), projects_controller_1.updateProject);
// delete routes
router.delete("/:id", auth_1.isAuthenticated, projects_controller_1.deleteProject);
router.put("/react/:id", auth_1.isAuthenticated, projects_controller_1.likeProject);
exports.default = router;
