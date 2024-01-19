import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table({ tableName: "users" })
export default class User extends Model {}
