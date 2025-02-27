// @types/project.ts
export interface IInstruction {
	id: string;
	text: string;
	imagePath?: string;
	image?: File;
	projectId?: string;
}

export interface ICreateProjectParams {
	id?: string;
	title: string;
	category: string;
	description: string;
	componentsUsed: string;
	instructions: IInstruction[];
	demoVideo?: string;
	authorId?: string;
	githubLink?: string;
	files?: Express.Multer.File[];
}

export interface IProject extends Omit<ICreateProjectParams, "files"> {
	id: string;
	createdAt: Date;
	updatedAt: Date;
}
