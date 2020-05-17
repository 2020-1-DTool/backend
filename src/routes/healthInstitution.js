import { Router } from "express"
import { Container } from "typedi"
import { Auth } from "../services"

export default appRouter => {
  const router = Router() // /healthInstitution
  const authService = Container.get(Auth)

  // exemplo de rota que requer autorização; apenas quem tem token de administração
  // consegue realizar um POST nessa rota (i.e. criar instituições de saúde)
  router.post("/", authService.middlewares.requireAppAdministration, (req, res) => {
    res.json({
      auth: req.auth,
      perms: Auth.PERMISSIONS,
    })
  })

  appRouter.use("/healthInstitution", router)
}
