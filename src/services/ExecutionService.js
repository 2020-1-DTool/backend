import Sequelize from "sequelize"
import config from "../config"
import { ExecutionDAO, RoleActivityDAO } from "../models"

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
   * Atualiza os relatórios consolidados na tabela `role_activities`.
   *
   * Essa função atualiza as durações mínima, mediana e máxima de todos os pares
   * atividade x ocupação, assim como o timestamp da última consolidação.
   */
  async updateConsolidatedReport(consolidatedReports) {

    for (const report of consolidatedReports) {
      RoleActivityDAO.update( {
        minimum: report.minimumDuration,
        median: report.medianDuration,
        maximum: report.maximumDuration,
        lastUpdate: (new Date()).toISOString(),
      },
      { where : { role_id : report.roleID, activity_id : report.activityID}})
    }
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
   * @returns {Promise<ConsolidatedReportEntry[]>} Objeto com informações consolidadas sobre todas as execuções de atividades da tecnologia.
   *
   * ----
   *
   * @typedef {Object} ConsolidatedReportEntry Objeto que descreve um registro consolidado de execuções de um par atividade-ocupação.
   * @property {number} activityID ID da atividade.
   * @property {string} activity Nome da atividade.
   * @property {number} roleID ID da ocupação.
   * @property {string} role Nome da ocupação
   * @property {number} minimumDuration Duração mínima das execuções, em minutos.
   * @property {number} medianDuration Mediana das durações das execuções, em minutos.
   * @property {number} maximumDuration Duração máxima das execuções, em minutos.
   * @property {string} lastUpdate Data/hora da última atualização dos dados consolidados (ISO 8601).
   */ 
  async exportConsolidatedExecutions(technologyID) {

    const sequelize = new Sequelize(config.databaseURL, {
      dialect: "postgres",
      define: {
        timestamps: false,
        underscored: true,
      },
    })

    const rawExecutionsData = await sequelize.query(
     `SELECT activity_id, activities.name as activity, role_id, roles.name as role, minimum, median, maximum
      FROM role_activities
      INNER JOIN activities ON role_activities.activity_id = activities.id
      INNER JOIN roles ON role_activities.role_id = roles.id
      WHERE activities.technology_id = ?;`,
      {
        replacements: [technologyID],
      }
    )
    
    return rawExecutionsData[0].map(rawResults => {
      return {
        activityID: rawResults.activity_id,
        activity: rawResults.activity,
        roleID: rawResults.role_id,
        role: rawResults.role,
        minimumDuration: (rawResults.minimum / 60).toFixed(2),
        medianDuration: (rawResults.median / 60).toFixed(2),
        maximumDuration: (rawResults.maximum / 60).toFixed(2),
      }
    })
  }

  /**
   * Gera um relatório com todas as execuções de atividades de uma tecnologia.
   *
   * @param {number} technologyID ID da tecnologia cujas execuções devem ser exportadas.
   * @returns {Promise<ExecutionEntry[]>} Lista com todas as execuções da tecnologia, ordenada pelo nome da ocupação.
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
