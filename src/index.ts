import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import consola from 'consola'

dotenv.config()

const app = express()

const port = process.env.APP_PORT || 4000

app.use(cors())

app.listen(port, () => {
  consola.start(`App on port: ${port}`)
})