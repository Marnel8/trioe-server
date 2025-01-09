"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRFQ = void 0;
const catchAsyncError_1 = __importDefault(require("../middleware/catchAsyncError"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const rfq_1 = require("../data/rfq");
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const path_1 = __importDefault(require("path"));
exports.createRFQ = (0, catchAsyncError_1.default)(async (req, res, next) => {
    const { firstName, lastName, email, kitName, contactNumber, organization, additionalRequirements, quantity, } = req.body;
    try {
        const rfq = await (0, rfq_1.createRFQData)({
            firstName,
            lastName,
            email,
            kitName,
            contactNumber,
            organization,
            additionalRequirements,
            quantity,
        });
        if (rfq instanceof errorHandler_1.default || !rfq) {
            return next(new errorHandler_1.default("Error creating RFQ", 500));
        }
        const data = {
            rfqData: rfq,
        };
        await (0, sendMail_1.default)({
            email: process.env.ADMIN_EMAIL,
            subject: "New Request for Quotation",
            template: "rfq-mail.ejs",
            data,
            attachments: [
                {
                    filename: "logo.png",
                    path: path_1.default.join(__dirname, "../assets/logo.png"),
                    cid: "logo",
                },
            ],
        });
        return res.status(200).json({ success: true });
    }
    catch (error) {
        console.error("Error in createRFQ:", error);
        return next(new errorHandler_1.default(error.message, 500));
    }
});
