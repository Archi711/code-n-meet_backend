import { Request, RequestHandler } from 'express'
import { LoginRequestData } from '../../types/index'
import { getUserByCredentials } from '../services/users.service'

const UserController: {
  [key: string]: RequestHandler<any, any, any, any, any>
} = {
  login: (req: Request<null, null, LoginRequestData>, res, next) => {
    const user = getUserByCredentials(req.body)
  },
}
