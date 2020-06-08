import { Router } from "express"
import { Container } from "typedi"
import { Auth, HealthInstitutionService, ExecutionService } from "../services"

export default appRouter => {
  const router = Router() // /reports
  const authService = Container.get(Auth)

  // relatório simples (para gráficos do app)
  router.get("/simple", authService.middlewares.authenticated, async (req, res) => {

    const executionService = Container.get(ExecutionService)
    const reportSimple = await executionService.exportConsolidatedExecutions(req.body.technology)

    if (Object.keys(reportSimple).length === 0) {
      res.status(404).json({
        code: "not_found/no_data_found",
        message: "There is no metrics related to this technology ID",
      })
      return
    }

    res.status(200).json(reportSimple)
  })

  // relatório completo (para gestores, XLSX)
  router.get("/complete", authService.middlewares.requireHospitalAdministration, async (req, res) => {
    // instituição vem a partir do token da autenticação; usar código de acesso para saber ID da instituição
    const healthInstitutionService = Container.get(HealthInstitutionService)
    const institution = await healthInstitutionService.getInformations(req.auth.accessCode)

    // TODO: implementar na task B03 (https://trello.com/c/VXgx1w4r)
    // usar função ReportService.generateCompleteReport(...)

    // exemplo de retorno de arquivo
    res.download("<arquivo temporário criado pelo ReportService>.xlsx", "Relatório dTool - <nome da instituição>.xlsx")
  })

  appRouter.use("/reports", router)
}
