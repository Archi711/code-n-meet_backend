import { EditPostData, PostBody } from './../../types/index'
import { RequestError } from '../../types/utils'
import prisma from '../../lib/prisma'
import { createService } from './index'
import { omit } from 'lodash'

const PostResponseSelect = {
  id: true,
  title: true,
  content: true,
  Group: {
    select: {
      id: true,
      name: true,
      User: {
        select: {
          id: true
        }
      }
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
  addPost: async (data: PostBody, id: number) => {
    const post = await prisma.post.create({
      select: { id: true },
      data: {
        title: data.title,
        content: data.content,
        Group: {
          connect: {
            id: data.idGroup,
          },
        },
        User: {
          connect: {
            id,
          },
        },
      },
    })
    return post
  },
  updatePost: async (data: EditPostData) => {
    const post = await prisma.post.update({
      where: {
        id: data.id
      },
      data: {
        ...(data.content && { content: data.content }),
        ...(data.title && { title: data.title }),
      }
    })
    return post
  },
  deletePost: async (id: number) => {
    const post = await prisma.post.delete({
      where: {
        id
      }
    })
    return post
  },
  getPost: async (id: number) => {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      select: PostResponseSelect,
    })
    return post
  },
  getPosts: async (page = 0) => {
    const posts = await prisma.post.findMany({
      select: PostResponseSelect,
      take: 10,
      skip: page * 10,
    })
    return posts
  },
})

export const {
  getGroupPosts,
  getPost,
  getUserPosts,
  addPost,
  getPosts,
  updatePost,
  deletePost
} = PostService
