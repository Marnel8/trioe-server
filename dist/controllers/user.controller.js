"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDetails = exports.logout = exports.login = exports.activateUser = exports.register = void 0;
const catchAsyncError_1 = __importDefault(require("../middleware/catchAsyncError"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const path_1 = __importDefault(require("path"));
const jwt_1 = require("../utils/jwt");
const user_service_1 = require("../services/user.service");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const user_1 = require("../data/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.register = (0, catchAsyncError_1.default)(async (req, res, next) => {
    const { firstName, lastName, email, password, type, gender, age, contactNumber, } = req.body;
    const avatar = req.file?.filename;
    try {
        const user = {
            firstName,
            lastName,
            email,
            password,
            age,
            type,
            gender,
            contactNumber,
            avatar,
        };
        const userExists = await (0, user_1.findUserByEmail)(email);
        if (userExists instanceof errorHandler_1.default) {
            if (userExists.statusCode !== 404) {
                return next();
            }
        }
        else {
            return next(new errorHandler_1.default("Email is already taken", 400));
        }
        const activationToken = (0, user_service_1.createActivationToken)(user);
        const activationCode = activationToken.activationCode;
        const data = { user, activationCode };
        await (0, sendMail_1.default)({
            email: user.email,
            subject: "Activate your account",
            template: "activation-mail.ejs",
            data,
            attachments: [
                {
                    filename: "logo.png",
                    path: path_1.default.join(__dirname, "../assets/logo.png"),
                    cid: "logo",
                },
            ],
        });
        res.status(201).json({
            success: true,
            message: `Please check your email: ${user.email} to activate your account`,
            activationToken: activationToken.token,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default("Failed to send activation email", 500));
    }
});
exports.activateUser = (0, catchAsyncError_1.default)(async (req, res, next) => {
    try {
        const { activation_token, activation_code } = req.body;
        const newUser = jsonwebtoken_1.default.verify(activation_token, process.env.ACTIVATION_SECRET);
        if (newUser.activationCode !== activation_code) {
            return next(new errorHandler_1.default("Invalid activation code", 400));
        }
        const { firstName, lastName, contactNumber, email, age, password, type, gender, avatar, } = newUser.user;
        const user = await (0, user_1.createUser)({
            firstName,
            lastName,
            contactNumber,
            email,
            password,
            type,
            age,
            gender,
            avatar,
        });
        if (user instanceof errorHandler_1.default) {
            return next(new errorHandler_1.default(user.message, user.statusCode));
        }
        res.status(201).json(user);
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
exports.login = (0, catchAsyncError_1.default)(async (req, res, next) => {
    const { email, password } = req.body;
    const userResult = await (0, user_1.findUserByEmail)(email);
    if (userResult instanceof errorHandler_1.default || !userResult) {
        return next(new errorHandler_1.default("User not found", 404));
    }
    const isPasswordMatch = await userResult.comparePassword(password);
    if (!isPasswordMatch) {
        return next(new errorHandler_1.default("Invalid password", 400));
    }
    (0, jwt_1.sendToken)(userResult, 200, res);
});
exports.logout = (0, catchAsyncError_1.default)(async (req, res, next) => {
    try {
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        res.status(200).json({
            success: true,
            message: "Logged out succesfully",
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
});
exports.getUserDetails = (0, catchAsyncError_1.default)(async (req, res, next) => {
    try {
        const user = await (0, user_1.getCurrentUser)(req);
        if (!user) {
            return next(new errorHandler_1.default("User not found", 404));
        }
        res.status(200).json(user);
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
});
