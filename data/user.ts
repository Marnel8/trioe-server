import ErrorHandler from "../utils/errorHandler";
import { CreateUserParams, FindUserParams } from "../@types/user";
import User from "../models/user/user.model";
import { Request } from "express";

export const createUser = async (userData: CreateUserParams) => {
	const user = await User.create({
		firstName: userData.firstName,
		lastName: userData.lastName,
		contactNumber: userData.contactNumber,
		email: userData.email,
		password: userData.password,
		age: userData.age,
		type: userData.type,
		gender: userData.gender,
		avatar: userData.avatar,
	});

	if (!user) {
		return new ErrorHandler("Failed to create user", 500);
	}

	console.log(user);

	return user;
};

export const findUserByEmail = async (email: string) => {
	const user = await User.findOne({ where: { email: email } });

	if (!user) {
		return new ErrorHandler("User not found", 404);
	}

	return user;
};

export const findUserById = async (id: string) => {
	const user = await User.findOne({ where: { id: id } });

	if (!user) {
		return new ErrorHandler("User not found", 404);
	}

	return user;
};

export const getCurrentUser = async (req: Request) => {
	const { id } = req?.user;

	const user = await User.findOne({ where: { id: id } });

	if (user instanceof ErrorHandler || !user) {
		return new ErrorHandler("User not found", 404);
	}

	return user;
};
