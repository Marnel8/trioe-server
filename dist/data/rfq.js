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
exports.createRFQData = void 0;
const QuotationReq_1 = require("../models/rfq/QuotationReq");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const createRFQData = (_a) => __awaiter(void 0, [_a], void 0, function* ({ firstName, lastName, email, kitName, contactNumber, organization, additionalRequirements, quantity, }) {
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
        const createdRFQ = yield QuotationReq_1.QuotationReq.create(data);
        if (!createdRFQ) {
            return new errorHandler_1.default("Error creating RFQ", 500);
        }
        return data;
    }
    catch (error) {
        return new Error(error.message);
    }
});
exports.createRFQData = createRFQData;
