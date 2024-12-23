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
	ForeignKey,
	BelongsTo,
} from "sequelize-typescript";
import { ProjectInstructions } from "./instructions";
import User from "../user/user.model";
import ProjectLike from "./projectLikes";

@Table({
	tableName: "projects",
	timestamps: true,
	modelName: "Project",
})
export class Project extends Model {
	@Column({
		type: DataType.UUID,
		primaryKey: true,
		defaultValue: DataType.UUIDV4,
	})
	declare id: string;

	@Column({ type: DataType.STRING, allowNull: false })
	declare title: string;

	@Column({ type: DataType.STRING, allowNull: false })
	declare category: string;

	@Column({ type: DataType.TEXT, allowNull: false })
	declare description: string;

	@Column({ type: DataType.TEXT, allowNull: false })
	declare componentsUsed: string;

	@Column({ type: DataType.TEXT, allowNull: true })
	declare githubLink: string;

	@Column({ type: DataType.TEXT, allowNull: true })
	declare demoVideo: string;

	@ForeignKey(() => User)
	@Column({ type: DataType.UUID, allowNull: false })
	declare authorId: string;

	@BelongsTo(() => User)
	declare author: User;

	@HasMany(() => ProjectInstructions)
	declare instructions: ProjectInstructions[];

	@HasMany(() => ProjectLike)
	declare likes: ProjectLike[];

	@CreatedAt
	declare createdAt: Date;

	@UpdatedAt
	declare updatedAt: Date;
}

export default Project;
