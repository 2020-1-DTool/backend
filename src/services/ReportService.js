import Excel from "exceljs"
import { Container } from "typedi"
import TechnologyService from "./TechnologyService"
import ExecutionService from "./ExecutionService"

export default class ReportService {
  /**
   * Gera um relatório completo com todos os dados de uma instituição de saúde.
   *
   * @param {number} institutionID ID da instituição cujo relatório deve ser gerado.
   * @returns {Promise<string>} Nome do arquivo XLSX temporário.
   */
  async generateCompleteReport(institutionID) {

    // Cria arquivo e adiciona algumas propriedades
    const workbook = new Excel.Workbook()
    workbook.creator = "dTool - AGES, PUCRS"
    workbook.lastModifiedBy = "dTool - AGES, PUCRS"
    workbook.created = new Date()
    workbook.views = [
      {
        x: 0,
        y: 0,
        width: 10000,
        height: 20000,
        firstSheet: 0,
        activeTab: 1,
        visibility: "visible",
      },
    ]

    // Cria serviços que serão usados
    const technologyService = Container.get(TechnologyService)
    const executionService = Container.get(ExecutionService)

    // Obtém as tecnologias da instituicão e para cada uma delas adiciona três abas
    const technologies = await technologyService.listTechnologies(institutionID)
    for (const tech of technologies) {

      // Adiciona aba "TECH - Definição"
      const definitions = workbook.addWorksheet(tech.name + " - Definição")
      const exportedTechnologies = await technologyService.exportTechnology(tech.id)

      definitions.columns = [{ header: " ", key: "activity", width: 50 }]

      for (let i = 0; i < exportedTechnologies.roles.length; i += 1) {
        const { name, shortName } = exportedTechnologies.roles[i]
        const role = shortName ? `${name} [${shortName}]` : name
        definitions.columns = definitions.columns.concat([{ header: role, width: 50, outlineLevel: 1 }])
      }

      for (let i = 0; i < exportedTechnologies.activities.length; i += 1) {
        const { name, shortName } = exportedTechnologies.activities[i]
        const activity = shortName ? `${name} [${shortName}]` : name
        definitions.addRow([activity, ...exportedTechnologies.matrix[i]])
      }

      // Adiciona aba "TECH - Execuções"
      const executions = workbook.addWorksheet(tech.name + " - Execuções")
      executions.columns = [
        { header: "Atividade", key: "activity", width: 50 },
        { header: "Ocupação", key: "role", width: 50 },
        { header: "Início", key: "timestamp", width: 50 },
        { header: "Duração (minutos)", key: "duration", width: 50 },
        { header: "Dispositivo", key: "deviceToken", width: 50 },
      ]

      const exportExecutions = await executionService.exportExecutions(tech.id)

      executions.addRows(exportExecutions)

      // Adiciona aba "TECH - Consolidado"
      const consolidatedExecutions = workbook.addWorksheet(tech.name + " - Consolidado")
      consolidatedExecutions.columns = [
        { header: "Atividade", key: "activity", width: 50 },
        { header: "Ocupação", key: "role", width: 50 },
        { header: "Mínimo (minutos)", key: "minimumDuration", width: 50 },
        { header: "Mediana (minutos)", key: "medianDuration", width: 50 },
        { header: "Máximo (minutos)", key: "maximumDuration", width: 50 },
      ]

      const exportConsolidatedExecutions = await executionService.exportConsolidatedExecutions(tech.id)

      consolidatedExecutions.addRows(exportConsolidatedExecutions)

    }

    // Exporta arquivo
    await workbook.xlsx.writeFile(`${institutionID}.xlsx`)

    return institutionID + ".xlsx"
  }
}
