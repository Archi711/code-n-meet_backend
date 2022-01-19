import { LoginRequestData, RegisterRequestData } from '../../types/index'
import prisma from '../../lib/prisma'
import { createService } from './index'
import { hashSync, compareSync } from 'bcryptjs'
import { RequestError } from '../../types/utils'
import { omit } from 'lodash'

const UserDataSelect = {
  id: true,
  name: true,
  email: true,
  githubNick: true,
  connectToGithub: true,
  profileDescription: true,
}

const UserService = createService({
  getUserByCredentials: async (body: LoginRequestData) => {
    const user = await prisma.user.findUnique({
      select: {
        password: true,
        ...UserDataSelect,
      },
      where: {
        login: body.login,
      },
    })
    if (!user || !compareSync(body.password, user.password))
      throw new RequestError(404)
    return omit(user, 'password')
  },
  getUserById: async (id: number) => {
    const user = await prisma.user.findUnique({
      select: UserDataSelect,
      where: { id },
    })
    if (!user) throw new RequestError(404)
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

export const { getUserByCredentials, saveNewUser, getUserById } = UserService
