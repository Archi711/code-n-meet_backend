import { RequestError } from './../../types/utils';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { EditProfileData, LoginRequestData, RegisterRequestData } from '../../types/index'
import {
  deleteUser,
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
    const userOrError = await saveNewUser(req.body)
    if (userOrError instanceof Error) return sendError(userOrError, res)

    return userOrError ? res.json({ success: true }) : res.json(new RequestError(500))
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
  },
  deleteUser: async (
    req: Request<any, any, { id: number, password: string }>,
    res: Response
  ) => {
    const user = await getUserById(req.body.id, true)
    if (user instanceof Error) return sendError(user, res)
    if (!bcrypt.compareSync(req.body.password, user.password)) return res.json(new RequestError(StatusCodes.FORBIDDEN))
    const confirmOrError = await deleteUser(req.body.id)
    if (confirmOrError instanceof Error) return sendError(confirmOrError, res)
    return res.json({ success: true })
  }
}

export default UserController
