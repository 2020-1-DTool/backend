import { Model, DataTypes, QueryTypes } from "sequelize"

export default class ExecutionDAO extends Model {
  static async getExecutionsReport(technologyID){
    return this.sequelize.query(`
      select A.name as activity,R.name as role, E.timestamp as timestamp ,E.duration/ 60 as duration, E.device_token as "deviceToken"
      from executions as E INNER JOIN role_activities as RA on E.role_id = RA.role_id AND E.activity_id = RA.activity_id
      INNER JOIN roles as R on RA.role_id = R.id
      INNER JOIN activities as A on RA.activity_id = A.id
      WHERE A.technology_id = :tech_id
      ORDER BY timestamp`,{
        type: QueryTypes.SELECT,
        replacements: {tech_id : technologyID},
      })
  }
}

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
