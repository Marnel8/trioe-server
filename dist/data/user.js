"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.findUserById = exports.findUserByEmail = exports.createUser = void 0;
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const user_model_1 = __importDefault(require("../models/user/user.model"));
const createUser = async (userData) => {
    const user = await user_model_1.default.create({
        firstName: userData.firstName,
        lastName: userData.lastName,
        contactNumber: userData.contactNumber,
        email: userData.email,
        password: userData.password,
        age: userData.age,
        type: userData.type,
        gender: userData.gender,
        avatar: userData.avatar,
    });
    if (!user) {
        return new errorHandler_1.default("Failed to create user", 500);
    }
    console.log(user);
    return user;
};
exports.createUser = createUser;
const findUserByEmail = async (email) => {
    const user = await user_model_1.default.findOne({ where: { email: email } });
    if (!user) {
        return new errorHandler_1.default("User not found", 404);
    }
    return user;
};
exports.findUserByEmail = findUserByEmail;
const findUserById = async (id) => {
    const user = await user_model_1.default.findOne({ where: { id: id } });
    if (!user) {
        return new errorHandler_1.default("User not found", 404);
    }
    return user;
};
exports.findUserById = findUserById;
const getCurrentUser = async (req) => {
    const { id } = req?.user;
    const user = await user_model_1.default.findOne({ where: { id: id } });
    if (user instanceof errorHandler_1.default || !user) {
        return new errorHandler_1.default("User not found", 404);
    }
    return user;
};
exports.getCurrentUser = getCurrentUser;
