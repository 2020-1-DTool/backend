import { Router } from "express"
import { Container } from "typedi"
import { Auth, HealthInstitutionService, ExecutionService } from "../services"

export default appRouter => {
  const router = Router() // /reports
  const authService = Container.get(Auth)

  // relatório simples (para gráficos do app)
  router.get("/simple", authService.middlewares.authenticated, async (req, res) => {
    // TODO implementar (https://trello.com/c/HiBdKv5z)
    // usar função ExecutionService.exportConsolidatedExecutions(...)
    const executionService = Container.get(ExecutionService)
    const reportSimple = await executionService.exportConsolidatedExecutions(req.body.technology)
    console.log(reportSimple)
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
