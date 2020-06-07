import { Router } from "express"
import { Container } from "typedi"
import { Auth, HealthInstitutionService, ReportService } from "../services"

export default appRouter => {
  const router = Router() // /reports
  const authService = Container.get(Auth)

  // relatório simples (para gráficos do app)
  router.get("/simple", authService.middlewares.authenticated, async (req, res) => {
    // TODO implementar (https://trello.com/c/HiBdKv5z)
    // usar função ExecutionService.exportConsolidatedExecutions(...)
  })

  // relatório completo (para gestores, XLSX)
  router.get("/complete", authService.middlewares.requireHospitalAdministration, async (req, res) => {
    // instituição vem a partir do token da autenticação; usar código de acesso para saber ID da instituição

    const healthInstitutionService = Container.get(HealthInstitutionService)
    const institution = await healthInstitutionService.getInformations(req.auth.accessCode)

    const reportService = Container.get(ReportService)
    const temporaryFile = await reportService.generateCompleteReport(institution.id)
    res.download(temporaryFile)
  })

  appRouter.use("/reports", router)
}
