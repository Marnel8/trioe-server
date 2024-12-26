import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import {
	createProjectData,
	deleteProjectData,
	getProjectByIdData,
	getProjectsByUserIdData,
	getProjectsData,
	likeProjectData,
	updateProjectData,
} from "../data/projects";
import { ICreateProjectParams } from "../@types/project";

export const createProject = catchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		const { title, description, category, componentsUsed, instructions } =
			req.body;

		const files = req.files as {
			images?: Express.Multer.File[];
			video?: Express.Multer.File[];
		};

		try {
			// Parse instructions JSON string
			const parsedInstructions = JSON.parse(instructions);

			// Map instructions with image paths
			const instructionsWithImages = parsedInstructions.map(
				(instruction: any, index: number) => ({
					text: instruction.text,
					imagePath: files?.images?.[index]?.filename || null,
				})
			);

			const project = await createProjectData({
				title,
				description,
				category,
				componentsUsed,
				instructions: instructionsWithImages,
				authorId: req.user.id,
				files: files?.images || [],
				demoVideo: files?.video?.[0]?.filename || null,
			} as ICreateProjectParams);

			if (project instanceof ErrorHandler || !project) {
				return next(new ErrorHandler("Failed to create project", 500));
			}

			return res.status(201).json({ success: true, project });
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 500));
		}
	}
);

export const getProjects = catchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const projects = await getProjectsData();

			if (projects instanceof ErrorHandler || !projects) {
				return next(new ErrorHandler("Projects not found", 404));
			}

			return res.status(200).json({ success: true, projects });
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 500));
		}
	}
);

export const getProjectsByUserId = catchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		const userId = req.user.id;

		try {
			const projects = await getProjectsByUserIdData(userId as string);

			if (projects instanceof ErrorHandler || !projects) {
				return next(new ErrorHandler("Projects not found", 404));
			}

			return res.status(200).json({ success: true, projects });
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 500));
		}
	}
);

export const updateProject = catchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;
		const { title, description, category, componentsUsed, instructions } =
			req.body;

		const files = req.files as {
			images?: Express.Multer.File[];
			video?: Express.Multer.File[];
		};

		try {
			// Parse instructions JSON string
			const parsedInstructions = JSON.parse(instructions);

			// Map instructions with image paths
			const instructionsWithImages = parsedInstructions.map(
				(instruction: any, index: number) => ({
					id: instruction.id,
					text: instruction.text,
					imagePath: files?.images?.[index]?.filename || null,
				})
			);

			const project = await updateProjectData(id, {
				title,
				description,
				category,
				componentsUsed,
				instructions: instructionsWithImages,
				githubLink: req.body.githubLink,
			} as ICreateProjectParams);

			if (project instanceof ErrorHandler || !project) {
				return next(new ErrorHandler("Failed to update project", 500));
			}

			return res.status(200).json({ success: true, project });
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 500));
		}
	}
);

export const getProjectById = catchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;

		try {
			const project = await getProjectByIdData(id as string);
			if (project instanceof ErrorHandler || !project) {
				return next(new ErrorHandler("Project not found", 404));
			}
			return res.status(200).json({ success: true, project });
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 500));
		}
	}
);

export const deleteProject = catchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;

		console.log(id);

		try {
			const project = await deleteProjectData(id);

			if (project instanceof ErrorHandler || !project) {
				return next(new ErrorHandler("Project not found", 404));
			}

			return res.status(200).json({ success: true, project });
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 500));
		}
	}
);

export const likeProject = catchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;
		const userId = req.user.id;

		try {
			const project = await likeProjectData(id, userId);

			if (project instanceof ErrorHandler || !project) {
				return next(new ErrorHandler("Project not found", 404));
			}

			return res.status(200).json({ success: true, project });
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 500));
		}
	}
);
