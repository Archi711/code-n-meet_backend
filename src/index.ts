import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import consola from 'consola'
import routes from './routes'
dotenv.config()

const app = express()

const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
  consola.info(`HANDLING\nroute: (${req.method})[${req.path}]`)
  return next()
})
app.use(routes)

app.listen(port, () => {
  consola.start(`App on port: ${port}`)
})
