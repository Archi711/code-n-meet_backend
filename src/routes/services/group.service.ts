import { RequestError } from './../../types/utils'
import prisma from '../../lib/prisma'
import { createService } from './index'
import { GroupCreateBody } from '../../types'
import { LoginRequestDataValidation } from '../../validations'

const GroupResponseSelect = {
  id: true,
  name: true,
  description: true,
  type: true,
  isPrivate: true,
  repoLink: true,
  User: {
    select: {
      id: true,
      name: true,
    },
  },
  Users: {
    select: {
      id: true,
      name: true,
    },
  },
}

export type GroupPrivacySP = 'all' | 'public' | 'private'

const GroupService = createService({
  getGroupById: async (id: number) => {
    const group = await prisma.group.findUnique({
      where: { id },
      select: GroupResponseSelect,
    })
    if (!group) return new RequestError(404)
    else return group
  },
  getUserGroups: async (id: number, privacy: GroupPrivacySP) => {
    const groups = await prisma.group.findMany({
      select: GroupResponseSelect,
      where: {
        Users: {
          some: {
            id,
          },
        },
        ...(privacy === 'public' && { isPrivate: false }),
        ...(privacy === 'private' && { isPrivate: true }),
      },
    })
    if (!groups) return new RequestError(404)
    return groups
  },
  getUserOwnedGroups: async (id: number, privacy: GroupPrivacySP) => {
    const groups = await prisma.group.findMany({
      where: {
        User: {
          id,
        },
        ...(privacy !== 'all' && privacy === 'public'
          ? { isPrivate: false }
          : { isPrivate: true }),
      },
    })
    if (!groups) return new RequestError(404)
    return groups
  },
  createGroup: async (id: number, body: GroupCreateBody) => {
    const group = await prisma.group.create({
      select: {
        id: true,
      },
      data: {
        ...body,
        User: {
          connect: {
            id,
          },
        },
        Users: {
          connect: {
            id,
          },
        },
      },
    })
    return group
  },
  getGroups: async (skip?: number) => {
    const groups = await prisma.group.findMany({
      select: GroupResponseSelect,
      where: {
        isPrivate: false,
      },
      take: 10,
      ...(skip && { skip }),
    })
    return groups
  },
  addToGroup: async (
    id: number,
    {
      login,
      id: uid,
    }: {
      login?: string
      id?: number
    }
  ) => {
    const connect = login ? { login } : uid ? { id: uid } : false
    if (!connect) throw new RequestError(400)
    const group = await prisma.group.update({
      where: { id },
      data: {
        Users: {
          connect,
        },
      },
    })
    return group
  },
})

export const {
  getGroupById,
  getUserGroups,
  getUserOwnedGroups,
  createGroup,
  getGroups,
  addToGroup,
} = GroupService
