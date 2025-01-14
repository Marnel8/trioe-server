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
exports.refreshToken = exports.getUserDetails = exports.logout = exports.login = exports.activateUser = exports.register = void 0;
const catchAsyncError_1 = __importDefault(require("../middleware/catchAsyncError"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const path_1 = __importDefault(require("path"));
const jwt_1 = require("../utils/jwt");
const user_service_1 = require("../services/user.service");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const user_model_1 = __importDefault(require("../models/user/user.model"));
const user_1 = require("../data/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const colors_1 = __importDefault(require("colors"));
exports.register = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { firstName, lastName, email, password, type, gender, age, contactNumber, } = req.body;
    const avatar = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
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
        const userExists = yield (0, user_1.findUserByEmail)(email);
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
        yield (0, sendMail_1.default)({
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
}));
exports.activateUser = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { activation_token, activation_code } = req.body;
        const newUser = jsonwebtoken_1.default.verify(activation_token, process.env.ACTIVATION_SECRET);
        if (newUser.activationCode !== activation_code) {
            return next(new errorHandler_1.default("Invalid activation code", 400));
        }
        const { firstName, lastName, contactNumber, email, age, password, type, gender, avatar, } = newUser.user;
        const user = yield (0, user_1.createUser)({
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
}));
exports.login = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const userResult = yield (0, user_1.findUserByEmail)(email);
    if (userResult instanceof errorHandler_1.default || !userResult) {
        return next(new errorHandler_1.default("User not found", 404));
    }
    const isPasswordMatch = yield userResult.comparePassword(password);
    if (!isPasswordMatch) {
        return next(new errorHandler_1.default("Invalid password", 400));
    }
    (0, jwt_1.sendToken)(userResult, 200, res);
}));
exports.logout = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
exports.getUserDetails = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { access_token } = req.cookies;
        console.log(colors_1.default.magenta(`access_token: ${access_token}`));
        if (!access_token) {
            return next(new errorHandler_1.default("Access token is missing", 401));
        }
        const decoded = jsonwebtoken_1.default.verify(access_token, process.env.ACCESS_TOKEN_SECRET);
        if (!decoded)
            return next(new errorHandler_1.default("Token is invalid", 401));
        const user = yield user_model_1.default.findByPk(decoded.id);
        if (!user) {
            return next(new errorHandler_1.default("User not found", 401));
        }
        res.status(200).json(user);
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
}));
exports.refreshToken = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refresh_token = req.cookies.refresh_token;
        if (!refresh_token) {
            return next(new errorHandler_1.default("Refresh token is missing", 401));
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
        }
        catch (error) {
            return next(new errorHandler_1.default("Invalid or expired refresh token", 401));
        }
        const userSession = yield user_model_1.default.findByPk(decoded.id);
        if (!userSession) {
            return next(new errorHandler_1.default("User not found", 404));
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: userSession.id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "1h",
        });
        const refreshToken = jsonwebtoken_1.default.sign({ id: userSession.id }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: "3d",
        });
        req.user = userSession;
        res.cookie("access_token", accessToken, jwt_1.accessTokenOptions);
        res.cookie("refresh_token", refreshToken, jwt_1.refreshTokenOptions);
        res.status(200).json({ success: true });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
}));
