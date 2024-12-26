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

@Table({
	tableName: "project_instructions",
	timestamps: true,
	modelName: "ProjectInstructions",
})
export class ProjectInstructions extends Model {
	@Column({
		type: DataType.UUID,
		primaryKey: true,
		defaultValue: DataType.UUIDV4,
	})
	declare id: string;

	@Column({ type: DataType.TEXT, allowNull: false })
	declare text: string;

	@Column({ type: DataType.STRING, allowNull: true })
	declare imagePath: string;

	@ForeignKey(() => Project)
	@Column({ type: DataType.UUID, allowNull: false })
	declare projectId: string;

	@BelongsTo(() => Project)
	declare project: Project;

	@CreatedAt
	declare createdAt: Date;

	@UpdatedAt
	declare updatedAt: Date;
}
