"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_typescript_1 = require("sequelize-typescript");
var user_model_1 = require("../models/user/user.model");
var colors_1 = require("colors");
var projects_model_1 = require("../models/projects/projects.model");
var projectLikes_1 = require("../models/projects/projectLikes");
var instructions_1 = require("../models/projects/instructions");
var QuotationReq_1 = require("../models/rfq/QuotationReq");
var subscribers_1 = require("../models/subscribers/subscribers");
var sequelize = new sequelize_typescript_1.Sequelize({
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
    .then(function () {
    console.log(colors_1.default.cyan("Connected to the database: ".concat(process.env.DB_NAME)));
})
    .catch(function (error) {
    console.error(colors_1.default.red("Unable to connect to the database:"), error);
});
sequelize
    .sync({ alter: true })
    .then(function () {
    console.log(colors_1.default.cyan("Database synchronized successfully."));
})
    .catch(function (error) {
    console.error(colors_1.default.red("Error synchronizing the database:"), error);
});
exports.default = sequelize;
