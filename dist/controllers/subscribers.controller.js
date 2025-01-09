"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSubscriber = void 0;
const catchAsyncError_1 = __importDefault(require("../middleware/catchAsyncError"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const subs_1 = require("../data/subs");
exports.addSubscriber = (0, catchAsyncError_1.default)(async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return next(new errorHandler_1.default("Email is required", 400));
        }
        const subscriber = await (0, subs_1.addSubscriberData)(email);
        // Add subscriber to database
        res.status(200).json({ success: true, message: "Subscriber added!" });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
});
