import express from "express"
import routes from "../routes"

export default app => {
  // middlewares
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))

  // routes
  app.use("/api", routes())
}
