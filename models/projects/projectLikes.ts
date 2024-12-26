import {
	Table,
	Column,
	Model,
	DataType,
	CreatedAt,
	UpdatedAt,
	ForeignKey,
	BelongsTo,
} from "sequelize-typescript";
import Project from "./projects.model";
import User from "../user/user.model";

@Table({
	tableName: "projectLikes",
	timestamps: true,
	modelName: "ProjectLike",
})
export default class ProjectLike extends Model {
	@Column({
		type: DataType.UUID,
		primaryKey: true,
		defaultValue: DataType.UUIDV4,
	})
	declare id: string;

	@ForeignKey(() => Project)
	@Column({ type: DataType.UUID, allowNull: false })
	declare projectId: string;

	@BelongsTo(() => Project)
	declare project: Project;

	@ForeignKey(() => User)
	@Column({ type: DataType.UUID, allowNull: false })
	declare userId: string;

	@BelongsTo(() => User)
	declare user: User;

	@CreatedAt
	declare createdAt: Date;

	@UpdatedAt
	declare updatedAt: Date;
}
