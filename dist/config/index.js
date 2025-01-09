"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = __importDefault(require("../models/user/user.model"));
const colors_1 = __importDefault(require("colors"));
const projects_model_1 = __importDefault(require("../models/projects/projects.model"));
const projectLikes_1 = __importDefault(require("../models/projects/projectLikes"));
const instructions_1 = require("../models/projects/instructions");
const QuotationReq_1 = require("../models/rfq/QuotationReq");
const subscribers_1 = require("../models/subscribers/subscribers");
const sequelize = new sequelize_typescript_1.Sequelize({
    database: process.env.DB_NAME,
    dialect: "mysql",
    username: process.env.DB_USER,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    models: [
        user_model_1.default,
        projects_model_1.default,
        instructions_1.ProjectInstructions,
        projectLikes_1.default,
        QuotationReq_1.QuotationReq,
        subscribers_1.Subscribers,
    ],
    password: process.env.DB_PASSWORD,
});
sequelize
    .authenticate()
    .then(() => {
    console.log(colors_1.default.cyan(`Connected to the database: ${process.env.DB_NAME}`));
})
    .catch((error) => {
    console.error(colors_1.default.red("Unable to connect to the database:"), error);
});
sequelize
    .sync({ alter: true })
    .then(() => {
    console.log(colors_1.default.cyan("Database synchronized successfully."));
})
    .catch((error) => {
    console.error(colors_1.default.red("Error synchronizing the database:"), error);
});
exports.default = sequelize;
