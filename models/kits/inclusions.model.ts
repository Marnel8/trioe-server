import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";

@Table({
	tableName: "kit_inclusions",
	timestamps: true,
	modelName: "KitInclusion",
})
export class KitInclusion extends Model {
	@Column({
		type: DataType.UUID,
		primaryKey: true,
		defaultValue: DataType.UUIDV4,
	})
	declare id: string;

	@Column({ type: DataType.NUMBER, allowNull: false })
	declare quantity: number;

	@Column({ type: DataType.STRING, allowNull: false })
	declare name: string;

	@Column({ type: DataType.STRING, allowNull: false })
	declare specifications: string;
}
