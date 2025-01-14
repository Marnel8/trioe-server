import { NextFunction, Request, Response } from "express";

import catchAsyncErrors from "./catchAsyncError";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user/user.model";
import ErrorHandler from "../utils/errorHandler";

import dotenv from "dotenv";
dotenv.config();

// Authenticated Users
export const isAuthenticated = catchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		const access_token = req?.cookies.access_token as string;

		console.log(access_token);

		if (!access_token)
			return next(
				new ErrorHandler("Please login to access this resource", 401)
			);

		const decoded = jwt.verify(
			access_token,
			process.env.ACCESS_TOKEN_SECRET || ""
		) as JwtPayload;

		if (!decoded)
			return next(
				new ErrorHandler("Access token is not valid. Please try again.", 401)
			);

		const user = await User.findOne({ where: { id: decoded.id } });

		if (!user) {
			return next(new ErrorHandler("User not found", 404));
		}

		req.user = user;

		next();
	}
);

// Validate user roles
export const authorizeRoles = (...roles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!roles.includes(req?.user.role || "")) {
			return next(
				new ErrorHandler(
					`Role: ${req.user?.role} is not allowed to access this resource`,
					404
				)
			);
		}
		next();
	};
};
