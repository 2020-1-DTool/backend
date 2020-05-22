import { Op } from "sequelize"
import { ExecutionDAO } from "../models"

export default class ExecutionService {

  async createExecution(payload) {
    try {
    payload.executions.forEach(function(itm){
      itm.deviceToken = payload.deviceToken;
     });
      await ExecutionDAO.bulkCreate(payload.executions)
      
    } catch (error) {
      console.log(error); 
    } 
    throw new Error('Ocorreu um problema com a inserção de dados no banco de dados');
  }
}