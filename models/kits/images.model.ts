import {
	Table,
	Column,
	Model,
	DataType,
	BelongsTo,
} from "sequelize-typescript";
import { Kit } from "./kit.model";

@Table({ tableName: "kits_images", modelName: "KitsImages" })
export class KitImages extends Model {
	@Column({
		type: DataType.UUID,
		primaryKey: true,
		defaultValue: DataType.UUIDV4,
	})
	declare id: string;

	@Column({ type: DataType.STRING, allowNull: false })
	declare imagePath: string;

	@BelongsTo(() => Kit)
	declare kit: Kit;
}
