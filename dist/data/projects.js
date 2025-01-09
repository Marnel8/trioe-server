"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeProjectData = exports.deleteProjectData = exports.getProjectByIdData = exports.updateProjectData = exports.getProjectsByUserIdData = exports.createProjectData = exports.getProjectsData = void 0;
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const projects_model_1 = __importDefault(require("../models/projects/projects.model"));
const instructions_1 = require("../models/projects/instructions");
const user_model_1 = __importDefault(require("../models/user/user.model"));
const projectLikes_1 = __importDefault(require("../models/projects/projectLikes"));
const getProjectsData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield projects_model_1.default.findAll({
            order: [["createdAt", "DESC"]],
            include: [
                { model: instructions_1.ProjectInstructions, as: "instructions" },
                { model: projectLikes_1.default, as: "likes" },
                {
                    model: user_model_1.default,
                    as: "author",
                    attributes: ["firstName", "lastName", "email", "id"],
                },
            ],
        });
        if (projects instanceof errorHandler_1.default || !projects) {
            return new errorHandler_1.default("Projects not found", 404);
        }
        return projects;
    }
    catch (error) {
        return new errorHandler_1.default(error.message, 500);
    }
});
exports.getProjectsData = getProjectsData;
const createProjectData = (projectData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create base project
        const project = yield projects_model_1.default.create({
            title: projectData.title,
            category: projectData.category,
            description: projectData.description,
            componentsUsed: projectData.componentsUsed,
            githubLink: projectData.githubLink,
            authorId: projectData.authorId,
            demoVideo: projectData.demoVideo,
        });
        if (!project) {
            console.error("Failed to create base project");
            return new errorHandler_1.default("Failed to create project", 500);
        }
        // Process instructions with their images
        const instructions = projectData.instructions.map((instruction, index) => ({
            text: instruction.text,
            imagePath: instruction.imagePath,
            projectId: project.id,
        }));
        // Create instructions
        const createdInstructions = yield instructions_1.ProjectInstructions.bulkCreate(instructions);
        // Fetch complete project with instructions
        const completeProject = yield projects_model_1.default.findOne({
            where: { id: project.id },
            include: [
                {
                    model: instructions_1.ProjectInstructions,
                    as: "instructions",
                },
            ],
        });
        return completeProject;
    }
    catch (error) {
        console.error("Data layer error:", error);
        return new errorHandler_1.default(error.message, 500);
    }
});
exports.createProjectData = createProjectData;
const getProjectsByUserIdData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield projects_model_1.default.findAll({
            where: {
                authorId: userId,
            },
        });
        if (projects instanceof errorHandler_1.default || !projects) {
            return new errorHandler_1.default("Projects not found", 404);
        }
        return projects;
    }
    catch (error) {
        return new errorHandler_1.default(error.message, 500);
    }
});
exports.getProjectsByUserIdData = getProjectsByUserIdData;
const updateProjectData = (projectId, projectData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const updatedCount = yield projects_model_1.default.update(projectData, {
            where: {
                id: projectId,
            },
        });
        if (updatedCount[0] === 0) {
            console.error("No project found to update");
            return new errorHandler_1.default("Project not found", 404);
        }
        // Fetch the updated project
        const updatedProject = yield projects_model_1.default.findOne({
            where: { id: projectId },
            include: [{ model: instructions_1.ProjectInstructions, as: "instructions" }],
        });
        console.log("Project updated successfully:", updatedProject);
        // Update instructions if provided
        if (projectData.instructions) {
            for (const instruction of projectData.instructions) {
                // Ensure instruction is defined before accessing its properties
                if (instruction && instruction.id) {
                    console.log(updatedProject);
                    // Update existing instruction
                    yield instructions_1.ProjectInstructions.update({
                        text: instruction.text,
                        imagePath: instruction.imagePath ||
                            ((_a = (yield (instructions_1.ProjectInstructions === null || instructions_1.ProjectInstructions === void 0 ? void 0 : instructions_1.ProjectInstructions.findOne({
                                where: { id: instruction === null || instruction === void 0 ? void 0 : instruction.id },
                            })))) === null || _a === void 0 ? void 0 : _a.imagePath), // Retain existing image if no new image is provided
                    }, { where: { id: instruction.id, projectId: updatedProject === null || updatedProject === void 0 ? void 0 : updatedProject.id } });
                }
                else if (instruction) {
                    // Create new instruction if it doesn't exist
                    yield instructions_1.ProjectInstructions.create({
                        text: instruction.text,
                        imagePath: instruction.imagePath,
                        projectId: updatedProject === null || updatedProject === void 0 ? void 0 : updatedProject.id,
                    });
                }
            }
        }
        return updatedProject; // Return the updated project
    }
    catch (error) {
        console.error("Data layer error during project update:", error);
        return new errorHandler_1.default(error.message, 500);
    }
});
exports.updateProjectData = updateProjectData;
const getProjectByIdData = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const project = yield projects_model_1.default.findOne({
            where: {
                id: projectId,
            },
            include: [
                { model: instructions_1.ProjectInstructions, as: "instructions" },
                { model: user_model_1.default, as: "author" },
                { model: projectLikes_1.default, as: "likes" },
            ],
        });
        if (project instanceof errorHandler_1.default || !project) {
            return new errorHandler_1.default("Project not found", 404);
        }
        return project;
    }
    catch (error) {
        return new errorHandler_1.default(error.message, 500);
    }
});
exports.getProjectByIdData = getProjectByIdData;
const deleteProjectData = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedCount = yield projects_model_1.default.destroy({
            where: {
                id: projectId,
            },
        });
        if (deletedCount === 0) {
            return new errorHandler_1.default("Project not found", 404);
        }
        return true;
    }
    catch (error) {
        return new errorHandler_1.default(error.message, 500);
    }
});
exports.deleteProjectData = deleteProjectData;
const likeProjectData = (projectId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const project = yield projects_model_1.default.findOne({
            where: { id: projectId },
        });
        if (!project) {
            return new errorHandler_1.default("Project not found", 404);
        }
        const projectLikes = yield projectLikes_1.default.findAll({
            where: {
                projectId: projectId,
            },
        });
        const existingLike = projectLikes.find((like) => like.userId === userId);
        if (existingLike) {
            yield projectLikes_1.default.destroy({
                where: {
                    id: existingLike.id,
                },
            });
        }
        else {
            yield projectLikes_1.default.create({
                projectId: projectId,
                userId: userId,
            });
        }
        return project;
    }
    catch (error) {
        return new errorHandler_1.default(error.message, 500);
    }
});
exports.likeProjectData = likeProjectData;
