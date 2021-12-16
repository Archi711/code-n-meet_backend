import { LoginRequestData, RegisterRequestData } from '../../types/index'
import prisma from '../../lib/prisma'
import { createService } from './index'
import { hashSync, compareSync } from 'bcryptjs'
import { RequestError } from '../../types/utils'

const UserService = createService({
  getUserByCredentials: async (body: LoginRequestData) => {
    const user = await prisma.user.findUnique({
      where: {
        login: body.login,
      },
    })
    if (!user) throw new RequestError(404)
    if (!compareSync(body.password, user.password)) throw new RequestError(401)
    return user
  },
  saveNewUser: async (body: RegisterRequestData) => {
    const data = {
      ...body,
      password: hashSync(body.password),
    }
    return await prisma.user.create({
      data,
    })
  },
})

export const { getUserByCredentials, saveNewUser } = UserService
