import { RequestError } from './../../types/utils'
import prisma from '../../lib/prisma'
import { createService } from './index'

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
      where: {
        Users: {
          some: {
            id,
          },
        },
        ...(privacy !== 'all' && privacy === 'public'
          ? { isPrivate: false }
          : { isPrivate: true }),
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
})

export const { getGroupById, getUserGroups, getUserOwnedGroups } = GroupService
