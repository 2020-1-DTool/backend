import Excel from "exceljs"

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

    return "teste.xlxs"
  }
}
