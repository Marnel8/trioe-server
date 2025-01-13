"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middleware/auth");
const uploader_1 = __importDefault(require("../utils/uploader"));
const router = (0, express_1.Router)();
// post routes
router.post("/register", uploader_1.default.single("avatar"), user_controller_1.register);
router.post("/activate-user", user_controller_1.activateUser);
router.post("/", user_controller_1.login);
// delete routes
router.post("/logout", auth_1.isAuthenticated, user_controller_1.logout);
// get routes
router.get("/me", auth_1.isAuthenticated, user_controller_1.getUserDetails);
exports.default = router;
