import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
export class RequestError extends Error {
  status: StatusCodes
  constructor(status: StatusCodes) {
    super(StatusCodes[status])
    this.status = status
  }
}

export const sendError = (error: Error | RequestError, res: Response) => {
  'status' in error
    ? res.sendStatus(error.status)
    : res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
}
