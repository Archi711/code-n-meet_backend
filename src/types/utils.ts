import { Response } from 'express'
import HttpStatusCode from './HttpStatusCode'

export class RequestError extends Error {
  status: HttpStatusCode
  constructor(status: HttpStatusCode) {
    super(HttpStatusCode[status])
    this.status = status
  }
}

export const sendError = (error: Error, res: Response) => {
  error instanceof RequestError
    ? res.sendStatus(error.status)
    : res.sendStatus(500)
}
