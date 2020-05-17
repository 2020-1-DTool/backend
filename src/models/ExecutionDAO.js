import { Model, DataTypes } from "sequelize"

export default class ExecutionDAO extends Model {}

export const setup = sequelize => {
  ExecutionDAO.init(
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // role_activities.role_id não é UNIQUE,
        // logo não tem como usar `references` do Sequelize
      },
      activityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // role_activities.activity_id não é UNIQUE,
        // logo não tem como usar `references` do Sequelize
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      duration: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      deviceToken: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize, modelName: "execution" }
  )
}
