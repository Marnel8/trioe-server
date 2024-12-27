import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import { KitImages } from "./images.model";

@Table({
	tableName: "kits",
	modelName: "Kit",
	timestamps: true,
})
export class Kit extends Model {
	@Column({
		type: DataType.UUID,
		primaryKey: true,
		defaultValue: DataType.UUIDV4,
	})
	declare id: string;

	@Column({ type: DataType.STRING, allowNull: false })
	declare name: string;

	@Column({ type: DataType.TEXT, allowNull: false })
	declare description: string;

	@Column({ type: DataType.STRING, allowNull: false })
	declare category: string;

	@Column({ type: DataType.NUMBER, allowNull: false })
	declare quantity: number;

	@Column({ type: DataType.FLOAT, allowNull: false })
	declare price: number;

	@Column({ type: DataType.STRING, allowNull: false })
	declare thumbnail: string;

	@HasMany(() => KitImages)
	declare images: KitImages[];
}
