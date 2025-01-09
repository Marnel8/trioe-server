"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRFQData = void 0;
const QuotationReq_1 = require("../models/rfq/QuotationReq");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const createRFQData = async ({ firstName, lastName, email, kitName, contactNumber, organization, additionalRequirements, quantity, }) => {
    try {
        const data = {
            firstName,
            lastName,
            email,
            kitName,
            contactNumber,
            organization,
            additionalRequirements,
            quantity,
        };
        const createdRFQ = await QuotationReq_1.QuotationReq.create(data);
        if (!createdRFQ) {
            return new errorHandler_1.default("Error creating RFQ", 500);
        }
        return data;
    }
    catch (error) {
        return new Error(error.message);
    }
};
exports.createRFQData = createRFQData;
