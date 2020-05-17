export default {
  port: parseInt(process.env.PORT, 10),

  databaseURL: process.env.DB_URL,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  adminCode: process.env.ADMIN_CODE,
}
