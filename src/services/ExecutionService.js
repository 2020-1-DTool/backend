import { ExecutionDAO } from "../models"

export default class ExecutionService {
  /**
   * Salva uma lista de execuções de atividades no banco de dados.
   * @param {{ deviceToken: string, executions: any[] ]}} payload Objeto com token do device que registrou as execuções e a lista de execuções que devem ser criadas.
   */
  async createExecution(payload) {
    const executions = payload.executions.map(execution => {
      return {
        ...execution,
        deviceToken: payload.deviceToken,
      }
    })

    await ExecutionDAO.bulkCreate(executions)
  }
}
