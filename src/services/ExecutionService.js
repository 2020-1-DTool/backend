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

  /**
   * Gera um relatório com os dados consolidados das execuções de atividades de uma tecnologia.
   * 
   * Atividades que não tiveram execuções por uma ocupação retornarão com durações iguais a `0`. Por exemplo,
   * se nenhum anestesista executou a atividade "Cuidados na SR", será retornado um objeto conforme xemplo abaixo:
   * 
   * ```
   *     {
   *       activityID: 3,
   *       activity: "Cuidados na SR",
   *       roleID: 2
   *       role: "Anestesista",
   *       minimumDuration: 0,
   *       medianDuration: 0,
   *       maximumDuration: 0,
   *     }
   * ```
   * 
   * @param {number} technologyID ID da tecnologia cujo relatório consolidado deve ser exportado.
   * @returns {ConsolidatedReportEntry[]} Lista com os dados consolidados de cada par atividade-ocupação, ordenados pelo nome da ocupação.
   * 
   * ----
   * 
   * Objeto que descreve um registro consolidado de execuções de um par atividade-ocupação.
   * @typedef {Object} ConsolidatedReportEntry
   * @property {number} activityID ID da atividade.
   * @property {string} activity Nome da atividade.
   * @property {number} roleID ID da ocupação.
   * @property {string} role Nome da ocupação
   * @property {number} minimumDuration Duração mínima das execuções, em minutos.
   * @property {number} medianDuration Mediana das durações das execuções, em minutos.
   * @property {number} maximumDuration Duração máxima das execuções, em minutos.
   */
  async exportConsolidatedExecutions(technologyID) {
    // TODO: implementar (https://trello.com/c/HiBdKv5z)

    // exemplo de retorno
    return [
      {
        activityID: 1,
        activity: "Cirurgia",
        roleID: 2,
        role: "Anestesista",
        minimumDuration: 37 / 60, // armazenado no banco em segundos, deve retornar em minutos
        medianDuration: 72 / 60, // armazenado no banco em segundos, deve retornar em minutos
        maximumDuration: 129 / 60 // armazenado no banco em segundos, deve retornar em minutos
      }
    ]
  }

  /**
   * Gera um relatório com todas as execuções de atividades de uma tecnologia.
   *
   * @param {number} technologyID ID da tecnologia cujas execuções devem ser exportadas.
   * @returns {ExecutionEntry[]} Lista com todas as execuções da tecnologia, ordenada pelo nome da ocupação.
   *
   * ----
   * 
   * Objeto que descreve um registro de execução.
   * @typedef {Object} ExecutionEntry
   * @property {string} activity Nome da atividade.
   * @property {string} role Nome da ocupação.
   * @property {string} timestamp Timestamp do início da execução.
   * @property {number} duration Duração da execução (em minutos).
   * @property {string} deviceToken Token que identifica o dispositivo onde a atividade foi executada.
   */
  async exportExecutions(technologyID) {
    // TODO: implementar na task B01 (https://trello.com/c/A3NnYIil)

    // exemplo de retorno
    return [
      {
        activity: "Cirurgia",
        role: "Anestesista",
        timestamp: "2020-05-31T12:44:58-0300",
        duration: 289 / 60, // armazenado no banco em segundos, deve retornar em minutos
        deviceToken: "323a5744-678c-426b-b086-3e442ece7179",
      },
    ]
  }
}
