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
      const definitions = workbook.addWorksheet(tech.name + " - Definição", {
        properties: {
          defaultColWidth: 20,
          defaultRowHeight: 32,
        },
        views: [{ state: "frozen", xSplit: 1, ySplit: 1 }],
      })
      const exportedTechnologies = await technologyService.exportTechnology(tech.id)

      definitions.columns = [{ header: " ", key: "activity"}]

      for (let i = 0; i < exportedTechnologies.roles.length; i += 1) {
        const { name, shortName } = exportedTechnologies.roles[i]
        const role = shortName ? `${name} [${shortName}]` : name
        definitions.columns = definitions.columns.concat([{ header: role, outlineLevel: 1, height: 32}])
      }

      for (let i = 0; i < exportedTechnologies.activities.length; i += 1) {
        const { name, shortName } = exportedTechnologies.activities[i]
        const activity = shortName ? `${name} [${shortName}]` : name
        definitions.addRow([activity, ...exportedTechnologies.matrix[i]])
      }

      const firstRow = definitions.getRow(1)
      firstRow.height = 48
      firstRow.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      }
      firstRow.border = { bottom: { style: "thin" } }

      const firstColumn = definitions.getColumn(1)
      firstColumn.width = 30
      firstColumn.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      }
      firstColumn.border = { right: { style: "thin" } }

      definitions.eachRow(row => {

        row.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        }

        row.font = {
          name: "Arial",
          size: 10,
          bold: false,
        }

      })

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

      const executionsFirstRow = executions.getRow(1)

      executionsFirstRow.eachCell(row => {

        row.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        }

        row.font = {
          name: "Arial",
          size: 10,
          bold: true,
        }

      })

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

      const consolidatedFirstRow = consolidatedExecutions.getRow(1)

      consolidatedFirstRow.eachCell(row => {

        row.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        }

        row.font = {
          name: "Arial",
          size: 10,
          bold: true,
        }

      })

      consolidatedExecutions.addRows(exportConsolidatedExecutions)
    }

    // Exporta arquivo
    await workbook.xlsx.writeFile(`${institutionID}.xlsx`)

    return institutionID + ".xlsx"
  }
}
