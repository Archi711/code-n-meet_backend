import { Request, Response } from 'express'
import { sendError } from '../../types/utils'
import { getGroupPosts, getUserPosts } from '../services/posts.service'

const PostsController = {
  getUserPosts: async (req: Request, res: Response) => {
    const postsOrError = await getUserPosts(+req.params.id)
    if (postsOrError instanceof Error) return sendError(postsOrError, res)
    return res.json(postsOrError)
  },
  getGroupPosts: async (req: Request, res: Response) => {
    const postsOrError = await getGroupPosts(+req.params.id)
    if (postsOrError instanceof Error) return sendError(postsOrError, res)
    return res.json(postsOrError)
  },
}

export default PostsController
