import { Model, DataTypes } from "sequelize"

export default class RoleActivityDAO extends Model {}

export const setup = sequelize => {
  RoleActivityDAO.init({
    minimum: DataTypes.DOUBLE,
    median: DataTypes.DOUBLE,
    maximum: DataTypes.DOUBLE,
  }, { sequelize, modelName: "role_activity" })
}
