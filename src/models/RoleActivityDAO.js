import { Model } from "sequelize"

export default class RoleActivityDAO extends Model {}

export const setup = sequelize => {
  RoleActivityDAO.init({}, { sequelize, modelName: "role_activity" })
}
