import { LoginRequestData, RegisterRequestData } from '../../types/index'
import prisma from '../../lib/prisma'
import { Service, ServiceAction } from './index'

type UserActions = 'getUserByCredentials' | 'saveNewUser'

const UsersService: Record<UserActions, ServiceAction> = {
  getUserByCredentials: async (body: LoginRequestData) => {
    return await prisma.user.findFirst({
      where: body,
    })
  },
  saveNewUser: async (body: RegisterRequestData) => {
    return await prisma.user.create({
      data: body,
    })
  },
}

export const { getUserByCredentials, saveNewUser } = UsersService
