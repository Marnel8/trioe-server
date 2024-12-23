import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middleware/catchAsyncError";
import sendMail from "../utils/sendMail";
import path from "path";
import { sendToken } from "../utils/jwt";
import { createActivationToken } from "../services/user.service";
import ErrorHandler from "../utils/errorHandler";
import User from "../models/user/user.model";
import { IActivationRequest } from "../@types/user";
import { createUser, findUserByEmail, getCurrentUser } from "../data/user";
import jwt from "jsonwebtoken";

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
      const user = await getCurrentUser(req);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      res.status(200).json(user);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
