import { Router } from "express"
import auth from "./auth"
import healthInstitution from "./healthInstitution"

export default () => {
  const appRouter = Router()

  // routes
  auth(appRouter)
  healthInstitution(appRouter)

  return appRouter
}
