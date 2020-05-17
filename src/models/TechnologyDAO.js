import { Model, DataTypes } from "sequelize"

export default class TechnologyDAO extends Model {}

export const setup = sequelize => {
  TechnologyDAO.init(
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize, modelName: "technology" }
  )
}
