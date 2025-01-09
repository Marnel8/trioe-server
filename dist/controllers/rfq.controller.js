import catchAsyncErrors from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import { createRFQData } from "../data/rfq";
import sendMail from "../utils/sendMail";
import path from "path";
export const createRFQ = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, kitName, contactNumber, organization, additionalRequirements, quantity, } = req.body;
    try {
        const rfq = await createRFQData({
            firstName,
            lastName,
            email,
            kitName,
            contactNumber,
            organization,
            additionalRequirements,
            quantity,
        });
        if (rfq instanceof ErrorHandler || !rfq) {
            return next(new ErrorHandler("Error creating RFQ", 500));
        }
        const data = {
            rfqData: rfq,
        };
        await sendMail({
            email: process.env.ADMIN_EMAIL,
            subject: "New Request for Quotation",
            template: "rfq-mail.ejs",
            data,
            attachments: [
                {
                    filename: "logo.png",
                    path: path.join(__dirname, "../assets/logo.png"),
                    cid: "logo",
                },
            ],
        });
        return res.status(200).json({ success: true });
    }
    catch (error) {
        console.error("Error in createRFQ:", error);
        return next(new ErrorHandler(error.message, 500));
    }
});
