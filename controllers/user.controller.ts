import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middleware/catchAsyncError";
import sendMail from "../utils/sendMail";
import path from "path";
import {
	accessTokenOptions,
	refreshTokenOptions,
	sendToken,
} from "../utils/jwt";
import { createActivationToken } from "../services/user.service";
import ErrorHandler from "../utils/errorHandler";
import User from "../models/user/user.model";
import { IActivationRequest } from "../@types/user";
import { createUser, findUserByEmail, getCurrentUser } from "../data/user";
import jwt, { JwtPayload } from "jsonwebtoken";
import colors from "colors";

export const register = catchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		const {
			firstName,
			lastName,
			email,
			password,
			type,
			gender,
			age,
			contactNumber,
		} = req.body;

		const avatar = req.file?.filename;

		try {
			const user = {
				firstName,
				lastName,
				email,
				password,
				age,
				type,
				gender,
				contactNumber,
				avatar,
			};

			const userExists = await findUserByEmail(email);

			if (userExists instanceof ErrorHandler) {
				if (userExists.statusCode !== 404) {
					return next();
				}
			} else {
				return next(new ErrorHandler("Email is already taken", 400));
			}

			const activationToken = createActivationToken(user);
			const activationCode = activationToken.activationCode;
			const data = { user, activationCode };

			await sendMail({
				email: user.email,
				subject: "Activate your account",
				template: "activation-mail.ejs",
				data,
				attachments: [
					{
						filename: "logo.png",
						path: path.join(__dirname, "../assets/logo.png"),
						cid: "logo",
					},
				],
			});

			res.status(201).json({
				success: true,
				message: `Please check your email: ${user.email} to activate your account`,
				activationToken: activationToken.token,
			});
		} catch (error) {
			return next(new ErrorHandler("Failed to send activation email", 500));
		}
	}
);

export const activateUser = catchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { activation_token, activation_code } =
				req.body as IActivationRequest;

			const newUser: { user: User; activationCode: string } = jwt.verify(
				activation_token,
				process.env.ACTIVATION_SECRET as string
			) as { user: User; activationCode: string };

			if (newUser.activationCode !== activation_code) {
				return next(new ErrorHandler("Invalid activation code", 400));
			}

			const {
				firstName,
				lastName,
				contactNumber,
				email,
				age,
				password,
				type,
				gender,
				avatar,
			} = newUser.user;

			const user = await createUser({
				firstName,
				lastName,
				contactNumber,
				email,
				password,
				type,
				age,
				gender,
				avatar,
			});

			if (user instanceof ErrorHandler) {
				return next(new ErrorHandler(user.message, user.statusCode));
			}

			res.status(201).json(user);
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 400));
		}
	}
);

export const login = catchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		const { email, password } = req.body;

		const userResult = await findUserByEmail(email);

		if (userResult instanceof ErrorHandler || !userResult) {
			return next(new ErrorHandler("User not found", 404));
		}

		const isPasswordMatch = await userResult.comparePassword(password);

		if (!isPasswordMatch) {
			return next(new ErrorHandler("Invalid password", 400));
		}

		sendToken(userResult, 200, res);
	}
);

export const logout = catchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			res.clearCookie("access_token");
			res.clearCookie("refresh_token");

			res.status(200).json({
				success: true,
				message: "Logged out succesfully",
			});
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 500));
		}
	}
);

export const getUserDetails = catchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { access_token } = req.cookies;

			console.log(colors.magenta(`access_token: ${access_token}`));

			if (!access_token) {
				return next(new ErrorHandler("Access token is missing", 401));
			}

			const decoded = jwt.verify(
				access_token,
				process.env.ACCESS_TOKEN_SECRET as string
			) as JwtPayload;

			if (!decoded) return next(new ErrorHandler("Token is invalid", 401));

			const user = await User.findByPk(decoded.id);

			if (!user) {
				return next(new ErrorHandler("User not found", 401));
			}

			res.status(200).json(user);
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 500));
		}
	}
);

export const refreshToken = catchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const refresh_token = req.cookies.refresh_token as string;

			if (!refresh_token) {
				return next(new ErrorHandler("Refresh token is missing", 401));
			}

			let decoded: JwtPayload;

			try {
				decoded = jwt.verify(
					refresh_token,
					process.env.REFRESH_TOKEN_SECRET as string
				) as JwtPayload;
			} catch (error) {
				return next(new ErrorHandler("Invalid or expired refresh token", 401));
			}

			const userSession = await User.findByPk(decoded.id);

			if (!userSession) {
				return next(new ErrorHandler("User not found", 404));
			}

			const accessToken = jwt.sign(
				{ id: userSession.id },
				process.env.ACCESS_TOKEN_SECRET as string,
				{
					expiresIn: "1h",
				}
			);

			const refreshToken = jwt.sign(
				{ id: userSession.id },
				process.env.REFRESH_TOKEN_SECRET as string,
				{
					expiresIn: "3d",
				}
			);

			req.user = userSession;

			res.cookie("access_token", accessToken, accessTokenOptions);
			res.cookie("refresh_token", refreshToken, refreshTokenOptions);

			res.status(200).json({ success: true });
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 500));
		}
	}
);
