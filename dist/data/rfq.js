import { QuotationReq } from "../models/rfq/QuotationReq";
import ErrorHandler from "../utils/errorHandler";
export const createRFQData = async ({ firstName, lastName, email, kitName, contactNumber, organization, additionalRequirements, quantity, }) => {
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
        const createdRFQ = await QuotationReq.create(data);
        if (!createdRFQ) {
            return new ErrorHandler("Error creating RFQ", 500);
        }
        return data;
    }
    catch (error) {
        return new Error(error.message);
    }
};
