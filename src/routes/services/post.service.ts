import { RequestError } from '../../types/utils'
import prisma from '../../lib/prisma'
import { createService } from './index'

const PostResponseSelect = {
  id: true,
  title: true,
  content: true,
  Group: {
    select: {
      id: true,
      name: true,
    },
  },
  User: {
    select: {
      id: true,
      name: true,
    },
  },
}
export const PostService = createService({
  getUserPosts: async (id: number) => {
    const posts = await prisma.post.findMany({
      select: PostResponseSelect,
      where: {
        User: {
          id,
        },
      },
    })
    if (!posts) return new RequestError(404)
    return posts
  },
  getGroupPosts: async (id: number) => {
    const posts = await prisma.post.findMany({
      select: PostResponseSelect,
      where: {
        Group: {
          id,
        },
      },
    })
    if (!posts) return new RequestError(404)
    return posts
  },
})

export const { getGroupPosts, getUserPosts } = PostService
