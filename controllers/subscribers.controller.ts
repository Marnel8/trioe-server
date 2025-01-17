import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import { addSubscriberData } from "../data/subs";
import sendMail from "../utils/sendMail";
import path from "path";

export const addSubscriber = catchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { email } = req.body;

			if (!email) {
				return next(new ErrorHandler("Email is required", 400));
			}

			const subscriber = await addSubscriberData(email);

			if (subscriber) {
				await sendMail({
					email: email,
					subject: "Welcome to Trioe",
					template: "subscriber-mail.ejs",
					data: { email },
					attachments: [
						{
							filename: "logo.png",
							path: path.join(__dirname, "../assets/logo.png"),
							cid: "logo",
						},
					],
				});
			}

			res.status(200).json({ success: true, message: "Subscriber added!" });
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 500));
		}
	}
);
