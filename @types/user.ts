import { Gender, UserRole, UserType } from "../models/user/userEnums";

export interface IUser {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	age: number;
	contactNumber: string;
	password: string;
	role: UserRole;
	type: UserType;
	comparePassword: (password: string) => Promise<boolean>;
	SignAccessToken: () => string;
	SignRefreshToken: () => string;
}

export type CreateUserParams = {
	firstName: string;
	lastName: string;
	email: string;
	age: number;
	contactNumber: string;
	password: string;
	type: UserType;
	gender: Gender;
	avatar?: string | undefined;
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
