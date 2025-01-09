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
exports.getCurrentUser = exports.findUserById = exports.findUserByEmail = exports.createUser = void 0;
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const user_model_1 = __importDefault(require("../models/user/user.model"));
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.create({
        firstName: userData.firstName,
        lastName: userData.lastName,
        contactNumber: userData.contactNumber,
        email: userData.email,
        password: userData.password,
        age: userData.age,
        type: userData.type,
        gender: userData.gender,
        avatar: (userData === null || userData === void 0 ? void 0 : userData.avatar) || "",
    });
    if (!user) {
        return new errorHandler_1.default("Failed to create user", 500);
    }
    console.log(user);
    return user;
});
exports.createUser = createUser;
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ where: { email: email } });
    if (!user) {
        return new errorHandler_1.default("User not found", 404);
    }
    return user;
});
exports.findUserByEmail = findUserByEmail;
const findUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ where: { id: id } });
    if (!user) {
        return new errorHandler_1.default("User not found", 404);
    }
    return user;
});
exports.findUserById = findUserById;
const getCurrentUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req === null || req === void 0 ? void 0 : req.user;
    const user = yield user_model_1.default.findOne({ where: { id: id } });
    if (user instanceof errorHandler_1.default || !user) {
        return new errorHandler_1.default("User not found", 404);
    }
    return user;
});
exports.getCurrentUser = getCurrentUser;
