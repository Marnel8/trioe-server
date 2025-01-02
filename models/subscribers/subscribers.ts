import {
	Table,
	Column,
	Model,
	DataType,
	CreatedAt,
	UpdatedAt,
} from "sequelize-typescript";

@Table({
	tableName: "subscribers",
	timestamps: true,
	modelName: "subscribers",
})
export class Subscribers extends Model {
	@Column({
		type: DataType.UUID,
		primaryKey: true,
		defaultValue: DataType.UUIDV4,
	})
	declare id: string;

	@Column({ type: DataType.STRING, allowNull: false })
	declare email: string;

	@CreatedAt
	declare createdAt: Date;

	@UpdatedAt
	declare updatedAt: Date;
}
