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
      //console.log(tech.name)
      const worksheet = workbook.addWorksheet(tech.name)
      worksheet.columns = [
        { header: " ", key: "activity", width: 10 },
        { header: "Name", key: "name", width: 32 },
        { header: "D.O.B.", key: "DOB", width: 10, outlineLevel: 1 },
      ]
      worksheet.columns.
      const exportTech = technologyService.exportTechnology(tech.id)
      //for(const activity of exportTech.activities) {
        
      //}
    }

    const worksheet = workbook.addWorksheet("My Sheet")

    

    //worksheet.addRow({ name: "John Doe", dob: new Date(1970, 1, 1) })
    //worksheet.addRow({ name: "Jane Doe", dob: new Date(1965, 1, 7) })

    // write to a file
    //const workbook = createAndFillWorkbook()
    await workbook.xlsx.writeFile("teste.xlsx")

    return "teste.xlsx"
  }
}
