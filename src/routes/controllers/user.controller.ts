import { NextFunction, Request, RequestHandler, Response } from 'express'
import { LoginRequestData, RegisterRequestData } from '../../types/index'
import { getUserByCredentials, saveNewUser } from '../services/user.service'
import { sendError } from '../../types/utils'

const UserController = {
  login: async (
    req: Request<any, any, LoginRequestData>,
    res: Response,
    next: NextFunction
  ) => {
    const userOrError = await getUserByCredentials(req.body)
    return userOrError instanceof Error
      ? sendError(userOrError, res)
      : res.json(userOrError)
  },
  register: async (
    req: Request<any, any, RegisterRequestData>,
    res: Response,
    next: NextFunction
  ) => {
    const user = await saveNewUser(req.body)
    return user ? res.sendStatus(200) : res.sendStatus(500)
  },
}

export default UserController
