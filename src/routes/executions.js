import { Router } from "express"
import { Container } from "typedi"
import { Auth, ExecutionService } from "../services"
import config from "../config"

export default appRouter => {
  const router = Router() // /execute
  const authService = Container.get(Auth)

  
  router.post("/", authService.middlewares.requireAppAdministration, (req, res) => {

    res.json({
      auth: req.auth,
      perms: Auth.PERMISSIONS,
    })
  })
  
  const deviceToken = req.body.deviceToken

  if (deviceToken == null){
      res.status(400).json({
        "code": "bad_request/missing_fields",
        "message": "fields 'deviceToken' and 'executions' are required, and there should be at least one execution"
      })
  }
  /*const executeRoleID
  const executeActivityID
  const executeTimestamp
  const executeDuration
  const executeDeviceToken*/

  appRouter.use("/executions", router)
}
