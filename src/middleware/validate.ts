import { RequestHandler } from 'express'
import { RequestValidationSchema } from '../types'
import consola from 'consola'

const validate =
  (schema: RequestValidationSchema): RequestHandler =>
    async (req, res, next) => {
      try {
        schema.body && (await schema.body.validate(req.body))
        schema.query && (await schema.query.validate(req.query))
        schema.params && (await schema.params.validate(req.params))
        return next()
      } catch (e) {
        consola.error(`Validation error: ${e}`)
        return res.sendStatus(400)
      }
    }

export default validate
