import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import Budget from "./Budget";

@Table({
  tableName: "expenses",
})
class Expense extends Model {
  @Column({
    type: DataType.STRING(100),
  })
  declare name: string;

  @Column({
    type: DataType.DECIMAL,
  })
  declare amount: number;

  //   Relación un gasto pertenece a un presupuesto
  @ForeignKey(() => Budget)
  declare budgetId: number;

  @BelongsTo(() => Budget)
  declare budget: Budget;
}

export default Expense;
