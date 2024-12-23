import { NextFunction, Request, Response } from "express";

import ErrorHandler from "../utils/errorHandler";

const ErrorMiddleware = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	err.statusCode = err.statusCode || 500;
	err.message = err.message || "Internal server error";

	// Duplicate key error
	if (err.statusCode === 11000) {
		const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
		err = new ErrorHandler(message, 400);
	}

	// wrong jwt error
	if (err.name === "JsonWebTokenError") {
		const message = `JSON web token is invalid, try again`;
		err = new ErrorHandler(message, 401);
	}
	// jwt token expired error
	if (err.name === "TokenExpiredError") {
		const message = `Json web token is expired, try again`;
		err = new ErrorHandler(message, 401);
	}

	res.status(err.statusCode).json({
		success: false,
		message: err.message,
	});
};

export default ErrorMiddleware;