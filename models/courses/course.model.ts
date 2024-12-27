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

@Table({
	tableName: "courses",
	timestamps: true,
	modelName: "Course",
})
export default class Course extends Model {
	@Column({
		type: DataType.UUID,
		primaryKey: true,
		defaultValue: DataType.UUIDV4,
	})
	declare id: string;

	@Column({ type: DataType.STRING, allowNull: false })
	declare courseTitle: string;

	@Column({ type: DataType.TEXT, allowNull: false })
	declare courseDescription: string;
}
