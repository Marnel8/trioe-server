"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.isAuthenticated = void 0;
const catchAsyncError_1 = __importDefault(require("./catchAsyncError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user/user.model"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
// Authenticated Users
exports.isAuthenticated = (0, catchAsyncError_1.default)(async (req, res, next) => {
    const access_token = req?.cookies.access_token;
    if (!access_token)
        return next(new errorHandler_1.default("Please login to access this resource", 401));
    const decoded = jsonwebtoken_1.default.verify(access_token, process.env.ACCESS_TOKEN_SECRET || "");
    if (!decoded)
        return next(new errorHandler_1.default("Access token is not valid. Please try again.", 401));
    const user = await user_model_1.default.findOne({ where: { id: decoded.id } });
    if (!user) {
        return next(new errorHandler_1.default("User not found", 404));
    }
    req.user = user;
    next();
});
// Validate user roles
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req?.user.role || "")) {
            return next(new errorHandler_1.default(`Role: ${req.user?.role} is not allowed to access this resource`, 404));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
