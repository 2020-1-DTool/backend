import { Router } from "express"
import { Container } from "typedi"
import { Auth, ExecutionService } from "../services"
import config from "../config"

export default appRouter => {
  const router = Router()
  const authService = Container.get(Auth)

  //Validação do Codigo de Entrada
  router.post("/", authService.middlewares.requireAppAdministration, (req, res) => {
    const executionService = Container.get(ExecutionService)
    const deviceToken = req.body.deviceToken

  // Confere se o Token for vazio e se não tiver nenhuma execução
    if (deviceToken == null || req.body.executions.length <= 0) {
      res.status(400).json({
        "code": "bad_request/missing_fields",
        "message": "fields 'deviceToken' and 'executions' are required, and there should be at least one execution"
      })
      return
    }

    for (var item of req.body.executions) {

      const activityId = item.activityId
      const roleId = item.roleId
      const timestamp = item.timestamp
      const duration = item.duration  

  // Confere se os valores não são nulos e se tiverem dados faltando
      if (activityId == null || roleId == null || timestamp == null || duration == null) {
        res.status(400).json({
          "code": "bad_request/missing_fields",
          "message": "fields 'deviceToken' and 'executions' are required, and there should be at least one execution"
        })
        return
      }
    };

  // Se passar do for, esta tudo certo com os dados e o payload tem uma ou mais execuções a serem enviadas ao banco
    executionService.createExecution(req.body)
    res.status(200)
  })
  appRouter.use("/executions", router)
}
