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
exports.createRFQ = void 0;
const catchAsyncError_1 = __importDefault(require("../middleware/catchAsyncError"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const rfq_1 = require("../data/rfq");
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const path_1 = __importDefault(require("path"));
exports.createRFQ = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, kitName, contactNumber, organization, additionalRequirements, quantity, } = req.body;
    try {
        const rfq = yield (0, rfq_1.createRFQData)({
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
        yield (0, sendMail_1.default)({
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
}));
