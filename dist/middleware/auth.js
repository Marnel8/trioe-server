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
exports.authorizeRoles = exports.isAuthenticated = void 0;
const catchAsyncError_1 = __importDefault(require("./catchAsyncError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user/user.model"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Authenticated Users
exports.isAuthenticated = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const access_token = req === null || req === void 0 ? void 0 : req.cookies.access_token;
    console.log(access_token);
    if (!access_token)
        return next(new errorHandler_1.default("Please login to access this resource", 401));
    const decoded = jsonwebtoken_1.default.verify(access_token, process.env.ACCESS_TOKEN_SECRET || "");
    if (!decoded)
        return next(new errorHandler_1.default("Access token is not valid. Please try again.", 401));
    const user = yield user_model_1.default.findOne({ where: { id: decoded.id } });
    if (!user) {
        return next(new errorHandler_1.default("User not found", 404));
    }
    req.user = user;
    next();
}));
// Validate user roles
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        var _a;
        if (!roles.includes((req === null || req === void 0 ? void 0 : req.user.role) || "")) {
            return next(new errorHandler_1.default(`Role: ${(_a = req.user) === null || _a === void 0 ? void 0 : _a.role} is not allowed to access this resource`, 404));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
