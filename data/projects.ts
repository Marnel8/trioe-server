import ErrorHandler from "../utils/errorHandler";
import Project from "../models/projects/projects.model";
import { ICreateProjectParams } from "../@types/project";
import { ProjectInstructions } from "../models/projects/instructions";
import User from "../models/user/user.model";

export const getProjectsData = async () => {
	try {
		const projects = await Project.findAll({
			order: [["createdAt", "DESC"]],
			include: [
				{ model: ProjectInstructions, as: "instructions" },
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
	} catch (error: any) {
		return new ErrorHandler(error.message, 500);
	}
};

export const createProjectData = async (projectData: ICreateProjectParams) => {
	try {
		console.log("Creating project with data:", projectData);

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

		console.log("Base project created:", project);

		// Process instructions with their images
		const instructions = projectData.instructions.map((instruction, index) => ({
			text: instruction.text,
			imagePath: instruction.imagePath,
			projectId: project.id,
		}));

		console.log("Creating instructions:", instructions);

		// Create instructions
		const createdInstructions = await ProjectInstructions.bulkCreate(
			instructions
		);
		console.log("Created instructions:", createdInstructions);

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
	} catch (error: any) {
		console.error("Data layer error:", error);
		return new ErrorHandler(error.message, 500);
	}
};

export const getProjectsByUserIdData = async (userId: string) => {
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
	} catch (error: any) {
		return new ErrorHandler(error.message, 500);
	}
};

export const updateProjectData = async (
	projectId: string,
	projectData: ICreateProjectParams
) => {
	try {
		const project = await Project.update(projectData, {
			where: {
				id: projectId,
			},
		});

		if (project instanceof ErrorHandler || !project) {
			return new ErrorHandler("Project not found", 404);
		}

		return project;
	} catch (error: any) {
		return new ErrorHandler(error.message, 500);
	}
};

export const getProjectByIdData = async (projectId: string) => {
	try {
		const project = await Project.findOne({
			where: {
				id: projectId,
			},
		});

		if (project instanceof ErrorHandler || !project) {
			return new ErrorHandler("Project not found", 404);
		}

		return project;
	} catch (error: any) {
		return new ErrorHandler(error.message, 500);
	}
};
