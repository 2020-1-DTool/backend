import Excel from "exceljs"

export default class ReportService {
  /**
   * Gera um relatório completo com todos os dados de uma instituição de saúde.
   *
   * @param {number} institutionID ID da instituição cujo relatório deve ser gerado.
   * @returns {string} Nome do arquivo XLSX temporário.
   */
  async generateCompleteReport(institutionID) {
    // TODO: implementar na task B03 (https://trello.com/c/VXgx1w4r)
    // usar funções TechnologyService.exportTechnology(...), ExecutionService.exportExecutions(...), ExecutionService.exportConsolidatedExecutions(...)
    // usar lib exceljs para gerar o arquivo XLSX (https://www.npmjs.com/package/exceljs)
  }
}
