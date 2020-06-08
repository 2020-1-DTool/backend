import Excel from "exceljs"
import { Container } from "typedi"
import { TechnologyService } from "../services"

export default class ReportService {
  /**
   * Gera um relatório completo com todos os dados de uma instituição de saúde.
   *
   * @param {number} institutionID ID da instituição cujo relatório deve ser gerado.
   * @returns {Promise<string>} Nome do arquivo XLSX temporário.
   */
  async generateCompleteReport(institutionID) {
    // TODO: implementar na task B03 (https://trello.com/c/VXgx1w4r)
    // usar funções TechnologyService.exportTechnology(...), ExecutionService.exportExecutions(...), ExecutionService.exportConsolidatedExecutions(...)
    // usar lib exceljs para gerar o arquivo XLSX (https://www.npmjs.com/package/exceljs)
    const ExcelJS = require("exceljs")

    const workbook = new Excel.Workbook()

    workbook.creator = "Me"
    workbook.lastModifiedBy = "Her"
    workbook.created = new Date(1985, 8, 30)
    workbook.modified = new Date()
    workbook.lastPrinted = new Date(2016, 9, 27)

    workbook.properties.date1904 = true

    workbook.calcProperties.fullCalcOnLoad = true

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

    const technologyService = Container.get(TechnologyService)
    const technologies = await technologyService.listTechnologies(institutionID)

    for (const tech of technologies) {

      //Adiciona sheet "TECH - Definição"
      const definicao = workbook.addWorksheet(tech.name + " - Definição")
      definicao.columns = [
        { header: " ", key: "activity", width: 50 },
      ]
      
      const exportTech = await technologyService.exportTechnology(tech.id)

      for (let i = 0; i < exportTech.roles.length; i += 1) {
        const { name, shortName } = exportTech.roles[i]
        const role = shortName ? `${name} [${shortName}]` : name
        definicao.columns = definicao.columns.concat([
          { header: role, width: 50, outlineLevel: 1 },
        ])
      }

      for (let i = 0; i < exportTech.activities.length; i += 1) {
        const { name, shortName } = exportTech.activities[i]
        const activity = shortName ? `${name} [${shortName}]` : name
        definicao.addRow([activity, ...exportTech.matrix[i]])
      }

      //Adiciona sheet "TECH - Execuções"
      const execucoes = workbook.addWorksheet(tech.name + " - Execuções")

      //Adiciona sheet "TECH - Consolidado"
      const consolidado = workbook.addWorksheet(tech.name + " - Consolidado")

    }

    await workbook.xlsx.writeFile("teste.xlsx")

    return "teste.xlsx"
  }
}
