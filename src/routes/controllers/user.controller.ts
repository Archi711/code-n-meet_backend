import jwt from 'jsonwebtoken';
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
    if (userOrError instanceof Error) sendError(userOrError, res)
    const token = jwt.sign({ id: userOrError.id }, process.env.JWT_SECRET as string)
    return res.json({
      token,
      user: userOrError
    })
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
