import { EditProfileData } from './../../types/index';
import { LoginRequestData, RegisterRequestData } from '../../types/index'
import prisma from '../../lib/prisma'
import { createService } from './index'
import { hashSync, compareSync } from 'bcryptjs'
import { RequestError } from '../../types/utils'
import { omit } from 'lodash'
import bcrypt from 'bcryptjs'

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
      return new RequestError(404)
    return omit(user, 'password')
  },
  getUserById: async (id: number, plain = false) => {
    const user = await prisma.user.findUnique({
      ...(!plain && { select: UserDataSelect }),
      where: { id },
    })
    if (!user) return new RequestError(404)
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
  updateUser: async (id: number, body: EditProfileData) => {
    const data = {
      ...body,
      ...(body.password && { password: hashSync(body.password) })
    }
    return await prisma.user.update({
      select: UserDataSelect,
      where: {
        id
      },
      data
    })
  },
  deleteUser: async (id: number) => {
    await prisma.user.delete({
      where: {
        id
      }
    })
    return {}
  }
})

export const { getUserByCredentials, saveNewUser, getUserById, updateUser, deleteUser } = UserService
