import ErrorHandler from "../utils/errorHandler";
import Project from "../models/projects/projects.model";
import { ProjectInstructions } from "../models/projects/instructions";
import User from "../models/user/user.model";
import ProjectLike from "../models/projects/projectLikes";
export const getProjectsData = async () => {
    try {
        const projects = await Project.findAll({
            order: [["createdAt", "DESC"]],
            include: [
                { model: ProjectInstructions, as: "instructions" },
                { model: ProjectLike, as: "likes" },
                {
                    model: User,
                    as: "author",
                    attributes: ["firstName", "lastName", "email", "id"],
                },
            ],
        });
        if (projects instanceof ErrorHandler || !projects) {
            return new ErrorHandler("Projects not found", 404);
        }
        return projects;
    }
    catch (error) {
        return new ErrorHandler(error.message, 500);
    }
};
export const createProjectData = async (projectData) => {
    try {
        // Create base project
        const project = await Project.create({
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
            return new ErrorHandler("Failed to create project", 500);
        }
        // Process instructions with their images
        const instructions = projectData.instructions.map((instruction, index) => ({
            text: instruction.text,
            imagePath: instruction.imagePath,
            projectId: project.id,
        }));
        // Create instructions
        const createdInstructions = await ProjectInstructions.bulkCreate(instructions);
        // Fetch complete project with instructions
        const completeProject = await Project.findOne({
            where: { id: project.id },
            include: [
                {
                    model: ProjectInstructions,
                    as: "instructions",
                },
            ],
        });
        return completeProject;
    }
    catch (error) {
        console.error("Data layer error:", error);
        return new ErrorHandler(error.message, 500);
    }
};
export const getProjectsByUserIdData = async (userId) => {
    try {
        const projects = await Project.findAll({
            where: {
                authorId: userId,
            },
        });
        if (projects instanceof ErrorHandler || !projects) {
            return new ErrorHandler("Projects not found", 404);
        }
        return projects;
    }
    catch (error) {
        return new ErrorHandler(error.message, 500);
    }
};
export const updateProjectData = async (projectId, projectData) => {
    try {
        const updatedCount = await Project.update(projectData, {
            where: {
                id: projectId,
            },
        });
        if (updatedCount[0] === 0) {
            console.error("No project found to update");
            return new ErrorHandler("Project not found", 404);
        }
        // Fetch the updated project
        const updatedProject = await Project.findOne({
            where: { id: projectId },
            include: [{ model: ProjectInstructions, as: "instructions" }],
        });
        console.log("Project updated successfully:", updatedProject);
        // Update instructions if provided
        if (projectData.instructions) {
            for (const instruction of projectData.instructions) {
                // Ensure instruction is defined before accessing its properties
                if (instruction && instruction.id) {
                    console.log(updatedProject);
                    // Update existing instruction
                    await ProjectInstructions.update({
                        text: instruction.text,
                        imagePath: instruction.imagePath ||
                            (await ProjectInstructions?.findOne({
                                where: { id: instruction?.id },
                            }))?.imagePath, // Retain existing image if no new image is provided
                    }, { where: { id: instruction.id, projectId: updatedProject?.id } });
                }
                else if (instruction) {
                    // Create new instruction if it doesn't exist
                    await ProjectInstructions.create({
                        text: instruction.text,
                        imagePath: instruction.imagePath,
                        projectId: updatedProject?.id,
                    });
                }
            }
        }
        return updatedProject; // Return the updated project
    }
    catch (error) {
        console.error("Data layer error during project update:", error);
        return new ErrorHandler(error.message, 500);
    }
};
export const getProjectByIdData = async (projectId) => {
    try {
        const project = await Project.findOne({
            where: {
                id: projectId,
            },
            include: [
                { model: ProjectInstructions, as: "instructions" },
                { model: User, as: "author" },
                { model: ProjectLike, as: "likes" },
            ],
        });
        if (project instanceof ErrorHandler || !project) {
            return new ErrorHandler("Project not found", 404);
        }
        return project;
    }
    catch (error) {
        return new ErrorHandler(error.message, 500);
    }
};
export const deleteProjectData = async (projectId) => {
    try {
        const deletedCount = await Project.destroy({
            where: {
                id: projectId,
            },
        });
        if (deletedCount === 0) {
            return new ErrorHandler("Project not found", 404);
        }
        return true;
    }
    catch (error) {
        return new ErrorHandler(error.message, 500);
    }
};
export const likeProjectData = async (projectId, userId) => {
    try {
        const project = await Project.findOne({
            where: { id: projectId },
        });
        if (!project) {
            return new ErrorHandler("Project not found", 404);
        }
        const projectLikes = await ProjectLike.findAll({
            where: {
                projectId: projectId,
            },
        });
        const existingLike = projectLikes.find((like) => like.userId === userId);
        if (existingLike) {
            await ProjectLike.destroy({
                where: {
                    id: existingLike.id,
                },
            });
        }
        else {
            await ProjectLike.create({
                projectId: projectId,
                userId: userId,
            });
        }
        return project;
    }
    catch (error) {
        return new ErrorHandler(error.message, 500);
    }
};
