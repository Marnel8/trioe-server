import * as bcrypt from "bcryptjs"; // Fixed import for bcryptjs
import * as jwt from "jsonwebtoken"; // Fixed import for jsonwebtoken
import {
	Table,
	Column,
	Model,
	DataType,
	CreatedAt,
	UpdatedAt,
	BeforeCreate,
	HasMany,
	BeforeUpdate,
} from "sequelize-typescript";
import { Gender, UserRole, UserType } from "./userEnums";
import Project from "../projects/projects.model";
import dotenv from "dotenv";
dotenv.config();

const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Table({
	tableName: "users",
	timestamps: true,
	modelName: "User",
})
export default class User extends Model {
	@Column({
		type: DataType.UUID,
		primaryKey: true,
		defaultValue: DataType.UUIDV4,
	})
	declare id: string;

	@Column({ type: DataType.STRING, allowNull: false })
	declare firstName: string;

	@Column({ type: DataType.STRING, allowNull: false })
	declare lastName: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
		// validate: {
		//   isEmail: {
		//     msg: "Invalid email format",
		//   },
		//   is: emailRegexPattern,
		// },
	})
	declare email: string;

	@Column({ type: DataType.INTEGER, allowNull: true })
	declare age: number;

	@Column({ type: DataType.STRING, allowNull: false })
	declare contactNumber: string;

	@Column({ type: DataType.STRING, allowNull: false })
	declare password: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
		defaultValue: UserRole.USER,
	})
	declare role: UserRole;

	@Column({ type: DataType.STRING, allowNull: false })
	declare type: UserType;

	@Column({ type: DataType.STRING, allowNull: false })
	declare gender: Gender;

	@Column({ type: DataType.STRING, allowNull: true })
	declare avatar: string;

	@HasMany(() => Project)
	declare projects: Project[];

	@CreatedAt
	declare createdAt: Date;

	@UpdatedAt
	declare updatedAt: Date;

	@BeforeCreate
	static async hashPassword(instance: User) {
		if (instance.password) {
			instance.password = await bcrypt.hash(instance.password, 10);
		}
	}

	@BeforeUpdate
	static async hashPasswordOnUpdate(instance: User) {
		if (instance.password) {
			instance.password = await bcrypt.hash(instance.password, 10);
		}
	}

	public SignAccessToken(): string {
		return jwt.sign(
			{
				id: this.id,
			},
			process.env.ACCESS_TOKEN_SECRET || "",
			{
				expiresIn: "1h",
			}
		);
	}

	public SignRefreshToken(): string {
		return jwt.sign(
			{
				id: this.id,
			},
			process.env.REFRESH_TOKEN_SECRET || "",
			{
				expiresIn: "3d",
			}
		);
	}

	public async comparePassword(enteredPassword: string): Promise<boolean> {
		return await bcrypt.compare(enteredPassword, this.password);
	}
}
