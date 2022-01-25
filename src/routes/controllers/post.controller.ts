import { sendError } from './../../types/utils'
import { PostBody } from './../../types/index'
import { Request, Response } from 'express'
import {
  addPost,
  getGroupPosts,
  getPost,
  getUserPosts,
} from '../services/post.service'

const PostController = {
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
  addPost: async (
    req: Request<any, any, PostBody & { jwtPayload: { id: number } }>,
    res: Response
  ) => {
    const postOrError = await addPost(req.body, req.body.jwtPayload.id)
    if (postOrError instanceof Error) return sendError(postOrError, res)
    return res.json(postOrError)
  },
  getPost: async (req: Request, res: Response) => {
    const postOrError = await getPost(Number(req.params.id))
    if (postOrError instanceof Error) return sendError(postOrError, res)
    return res.json(postOrError)
  },
}

export default PostController
