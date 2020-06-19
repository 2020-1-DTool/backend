export default {
  port: parseInt(process.env.PORT, 10),
  databaseURL: process.env.DB_URL,

  jwtSecret: process.env.JWT_SECRET ?? "secret-key",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
  reportsCronFrequency: process.env.REPORTS_CRON_FREQUENCY ?? "*/15 * * * *",
  adminCode: process.env.ADMIN_CODE ?? "0000",
}
