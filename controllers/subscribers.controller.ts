import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import { addSubscriberData } from "../data/subs";

export const addSubscriber = catchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { email } = req.body;

			if (!email) {
				return next(new ErrorHandler("Email is required", 400));
			}

			const subscriber = await addSubscriberData(email);

			// Add subscriber to database
			res.status(200).json({ success: true, message: "Subscriber added!" });
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 500));
		}
	}
);
