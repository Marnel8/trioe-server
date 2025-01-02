import {
	Table,
	Column,
	Model,
	DataType,
	CreatedAt,
	UpdatedAt,
} from "sequelize-typescript";

@Table({
	tableName: "quotation_req",
	timestamps: true,
	modelName: "QuotationReq",
})
export class QuotationReq extends Model {
	@Column({
		type: DataType.UUID,
		primaryKey: true,
		defaultValue: DataType.UUIDV4,
	})
	declare id: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	declare firstName: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	declare lastName: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	declare email: string;

	@Column({
		type: DataType.INTEGER,
		allowNull: true,
	})
	declare contactNumber: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	declare organization: string;

	@Column({
		type: DataType.TEXT,
		allowNull: true,
	})
	declare additionalRequirements: string;

	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	declare quantity: number;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	declare kitName: string;

	@CreatedAt
	declare createdAt: Date;

	@UpdatedAt
	declare updatedAt: Date;
}
