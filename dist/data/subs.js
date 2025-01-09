import { Subscribers } from "../models/subscribers/subscribers";
import ErrorHandler from "../utils/errorHandler";
export const addSubscriberData = async (email) => {
    try {
        const subscriberExists = await Subscribers.findOne({
            where: { email },
        });
        if (subscriberExists) {
            return new ErrorHandler("Email already subscribed!", 400);
        }
        const subscriber = await Subscribers.create({ email });
        if (!subscriber) {
            return new ErrorHandler("Error creating subscriber", 500);
        }
        return subscriber;
    }
    catch (error) {
        return new ErrorHandler(error.message, 500);
    }
};
