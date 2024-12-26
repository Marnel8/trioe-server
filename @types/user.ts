import { Gender, UserRole, UserType } from "../models/user/userEnums";

export type CreateUserParams = {
	firstName: string;
	lastName: string;
	email: string;
	age: number;
	contactNumber: string;
	password: string;
	type: UserType;
	gender: Gender;
	avatar?: string;
};

export type FindUserParams = {
	email: string;
};

export type IActivationToken = {
	token: string;
	activationCode: string;
};

export type IActivationRequest = {
	activation_token: string;
	activation_code: string;
};
