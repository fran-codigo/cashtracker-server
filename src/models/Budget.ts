import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsTo,
  ForeignKey,
  AllowNull
} from "sequelize-typescript";
import Expense from "./Expense";

@Table({
  tableName: "budgets",
})
class Budget extends Model {
  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
  })
  declare name: string;
  
  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL,
  })
  declare amount: number;

  // Relación uno a muchos, un presupuesto tiene muchos gastos
  @HasMany(() => Expense, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  declare expenses: Expense[];
}

export default Budget;
