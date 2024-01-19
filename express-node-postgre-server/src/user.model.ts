import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table({ tableName: "users" })
export default class User extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "id",
  })
  id?: number;
}
