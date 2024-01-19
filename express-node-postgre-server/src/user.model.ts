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

  @Column({
    type: DataType.STRING(255),
    field: "username",
  })
  username?: string;

  @Column({
    type: DataType.STRING(255),
    field: "firstName",
  })
  firstName?: string;

  @Column({
    type: DataType.STRING(255),
    field: "lastName",
  })
  lastName?: string;

  @Column({
    type: DataType.STRING(255),
    field: "email",
  })
  email?: string;
}
