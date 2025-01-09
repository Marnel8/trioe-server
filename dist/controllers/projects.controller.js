"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeProject = exports.deleteProject = exports.getProjectById = exports.updateProject = exports.getProjectsByUserId = exports.getProjects = exports.createProject = void 0;
const catchAsyncError_1 = __importDefault(require("../middleware/catchAsyncError"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const projects_1 = require("../data/projects");
exports.createProject = (0, catchAsyncError_1.default)(async (req, res, next) => {
    const { title, description, category, componentsUsed, instructions } = req.body;
    const files = req.files;
    try {
        // Parse instructions JSON string
        const parsedInstructions = JSON.parse(instructions);
        // Map instructions with image paths
        const instructionsWithImages = parsedInstructions.map((instruction, index) => ({
            text: instruction.text,
            imagePath: files?.images?.[index]?.filename || null,
        }));
        const project = await (0, projects_1.createProjectData)({
            title,
            description,
            category,
            componentsUsed,
            instructions: instructionsWithImages,
            authorId: req.user?.id,
            files: files?.images || [],
            demoVideo: files?.video?.[0]?.filename || null,
        });
        if (project instanceof errorHandler_1.default || !project) {
            return next(new errorHandler_1.default("Failed to create project", 500));
        }
        return res.status(201).json({ success: true, project });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
});
exports.getProjects = (0, catchAsyncError_1.default)(async (req, res, next) => {
    try {
        const projects = await (0, projects_1.getProjectsData)();
        if (projects instanceof errorHandler_1.default || !projects) {
            return next(new errorHandler_1.default("Projects not found", 404));
        }
        return res.status(200).json({ success: true, projects });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
});
exports.getProjectsByUserId = (0, catchAsyncError_1.default)(async (req, res, next) => {
    const userId = req.user.id;
    try {
        const projects = await (0, projects_1.getProjectsByUserIdData)(userId);
        if (projects instanceof errorHandler_1.default || !projects) {
            return next(new errorHandler_1.default("Projects not found", 404));
        }
        return res.status(200).json({ success: true, projects });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
});
exports.updateProject = (0, catchAsyncError_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const { title, description, category, componentsUsed, instructions } = req.body;
    const files = req.files;
    try {
        // Parse instructions JSON string
        const parsedInstructions = JSON.parse(instructions);
        // Map instructions with image paths
        const instructionsWithImages = parsedInstructions.map((instruction, index) => ({
            id: instruction.id,
            text: instruction.text,
            imagePath: files?.images?.[index]?.filename || null,
        }));
        const project = await (0, projects_1.updateProjectData)(id, {
            title,
            description,
            category,
            componentsUsed,
            instructions: instructionsWithImages,
            githubLink: req.body.githubLink,
        });
        if (project instanceof errorHandler_1.default || !project) {
            return next(new errorHandler_1.default("Failed to update project", 500));
        }
        return res.status(200).json({ success: true, project });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
});
exports.getProjectById = (0, catchAsyncError_1.default)(async (req, res, next) => {
    const { id } = req.params;
    try {
        const project = await (0, projects_1.getProjectByIdData)(id);
        if (project instanceof errorHandler_1.default || !project) {
            return next(new errorHandler_1.default("Project not found", 404));
        }
        return res.status(200).json({ success: true, project });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
});
exports.deleteProject = (0, catchAsyncError_1.default)(async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    try {
        const project = await (0, projects_1.deleteProjectData)(id);
        if (project instanceof errorHandler_1.default || !project) {
            return next(new errorHandler_1.default("Project not found", 404));
        }
        return res.status(200).json({ success: true, project });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
});
exports.likeProject = (0, catchAsyncError_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const project = await (0, projects_1.likeProjectData)(id, userId);
        if (project instanceof errorHandler_1.default || !project) {
            return next(new errorHandler_1.default("Project not found", 404));
        }
        return res.status(200).json({ success: true, project });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
});
