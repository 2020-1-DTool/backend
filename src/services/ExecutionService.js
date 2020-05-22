import { Op } from "sequelize"
import { ExecutionDAO } from "../models"

export default class ExecutionService {

  async createExecution(payload) {
    payload.executions.forEach(function(itm){
      itm.deviceToken = payload.deviceToken;
     });
      await ExecutionDAO.bulkCreate(payload.executions)
  }
}