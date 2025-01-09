"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSubscriberData = void 0;
const subscribers_1 = require("../models/subscribers/subscribers");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const addSubscriberData = async (email) => {
    try {
        const subscriberExists = await subscribers_1.Subscribers.findOne({
            where: { email },
        });
        if (subscriberExists) {
            return new errorHandler_1.default("Email already subscribed!", 400);
        }
        const subscriber = await subscribers_1.Subscribers.create({ email });
        if (!subscriber) {
            return new errorHandler_1.default("Error creating subscriber", 500);
        }
        return subscriber;
    }
    catch (error) {
        return new errorHandler_1.default(error.message, 500);
    }
};
exports.addSubscriberData = addSubscriberData;
