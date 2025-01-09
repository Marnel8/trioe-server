import { UserRole, UserType } from "../models/user/userEnums";

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
