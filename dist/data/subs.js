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
exports.addSubscriberData = void 0;
const subscribers_1 = require("../models/subscribers/subscribers");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const addSubscriberData = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscriberExists = yield subscribers_1.Subscribers.findOne({
            where: { email },
        });
        if (subscriberExists) {
            return new errorHandler_1.default("Email already subscribed!", 400);
        }
        const subscriber = yield subscribers_1.Subscribers.create({ email });
        if (!subscriber) {
            return new errorHandler_1.default("Error creating subscriber", 500);
        }
        return subscriber;
    }
    catch (error) {
        return new errorHandler_1.default(error.message, 500);
    }
});
exports.addSubscriberData = addSubscriberData;
