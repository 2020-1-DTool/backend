import { Router } from "express"
import auth from "./auth"
import healthInstitution from "./healthInstitution"
import executions from "./executions"

export default () => {
  const appRouter = Router()

  // routes
  auth(appRouter)
  healthInstitution(appRouter)
  executions(appRouter)

  return appRouter
}
