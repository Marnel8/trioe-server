import catchAsyncErrors from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import { createProjectData, deleteProjectData, getProjectByIdData, getProjectsByUserIdData, getProjectsData, likeProjectData, updateProjectData, } from "../data/projects";
export const createProject = catchAsyncErrors(async (req, res, next) => {
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
        const project = await createProjectData({
            title,
            description,
            category,
            componentsUsed,
            instructions: instructionsWithImages,
            authorId: req.user.id,
            files: files?.images || [],
            demoVideo: files?.video?.[0]?.filename || null,
        });
        if (project instanceof ErrorHandler || !project) {
            return next(new ErrorHandler("Failed to create project", 500));
        }
        return res.status(201).json({ success: true, project });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
export const getProjects = catchAsyncErrors(async (req, res, next) => {
    try {
        const projects = await getProjectsData();
        if (projects instanceof ErrorHandler || !projects) {
            return next(new ErrorHandler("Projects not found", 404));
        }
        return res.status(200).json({ success: true, projects });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
export const getProjectsByUserId = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user.id;
    try {
        const projects = await getProjectsByUserIdData(userId);
        if (projects instanceof ErrorHandler || !projects) {
            return next(new ErrorHandler("Projects not found", 404));
        }
        return res.status(200).json({ success: true, projects });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
export const updateProject = catchAsyncErrors(async (req, res, next) => {
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
        const project = await updateProjectData(id, {
            title,
            description,
            category,
            componentsUsed,
            instructions: instructionsWithImages,
            githubLink: req.body.githubLink,
        });
        if (project instanceof ErrorHandler || !project) {
            return next(new ErrorHandler("Failed to update project", 500));
        }
        return res.status(200).json({ success: true, project });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
export const getProjectById = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    try {
        const project = await getProjectByIdData(id);
        if (project instanceof ErrorHandler || !project) {
            return next(new ErrorHandler("Project not found", 404));
        }
        return res.status(200).json({ success: true, project });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
export const deleteProject = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    try {
        const project = await deleteProjectData(id);
        if (project instanceof ErrorHandler || !project) {
            return next(new ErrorHandler("Project not found", 404));
        }
        return res.status(200).json({ success: true, project });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
export const likeProject = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const project = await likeProjectData(id, userId);
        if (project instanceof ErrorHandler || !project) {
            return next(new ErrorHandler("Project not found", 404));
        }
        return res.status(200).json({ success: true, project });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
