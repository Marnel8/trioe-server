import { Sequelize } from "sequelize-typescript";
import User from "../models/user/user.model";
import Project from "../models/projects/projects.model";
import ProjectLike from "../models/projects/projectLikes";
import { ProjectInstructions } from "../models/projects/instructions";
import { QuotationReq } from "../models/rfq/QuotationReq";
import { Subscribers } from "../models/subscribers/subscribers";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize({
	database: process.env.DB_NAME,
	dialect: "mysql",
	username: process.env.DB_USER,
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	models: [
		User,
		Project,
		ProjectInstructions,
		ProjectLike,
		QuotationReq,
		Subscribers,
	],
	password: process.env.DB_PASSWORD,
});

sequelize
	.authenticate()
	.then(() => {
		console.log(`Connected to the database: ${process.env.DB_NAME}`);
	})
	.catch((error) => {
		console.error("Unable to connect to the database:", error);
	});

export default sequelize;
