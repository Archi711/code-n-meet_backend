import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { EditProfileData, LoginRequestData, RegisterRequestData } from '../../types/index'
import {
  getUserByCredentials,
  getUserById,
  saveNewUser,
  updateUser,
} from '../services/user.service'
import { sendError } from '../../types/utils'
import omit from 'lodash/omit'

const UserController = {
  login: async (
    req: Request<any, any, LoginRequestData>,
    res: Response,
    next: NextFunction
  ) => {
    const userOrError = await getUserByCredentials(req.body)
    if (userOrError instanceof Error) return sendError(userOrError, res)
    const token = jwt.sign(
      { id: userOrError.id },
      process.env.JWT_SECRET as string
    )
    return res.json({
      token,
      user: userOrError,
    })
  },
  signup: async (
    req: Request<any, any, RegisterRequestData>,
    res: Response) => {
    const user = await saveNewUser(req.body)
    return user ? res.sendStatus(200) : res.sendStatus(500)
  },
  getById: async (req: Request, res: Response) => {
    const user = await getUserById(+req.params.id)
    return res.json(user)
  },
  updateUser: async (
    req: Request<any, any, Partial<EditProfileData> & { jwtPayload: { id: number } }>,
    res: Response) => {
    const user = await updateUser(req.body.jwtPayload?.id, omit(req.body, 'jwtPayload'))
    return res.json(user)
  }
}

export default UserController
