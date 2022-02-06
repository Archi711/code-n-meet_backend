import { RequestError, sendError } from './../../types/utils'
import { DeletePostData, EditPostData, PostBody } from './../../types/index'
import { Request, Response } from 'express'
import {
  addPost,
  deletePost,
  getGroupPosts,
  getPost,
  getPosts,
  getUserPosts,
  updatePost,
} from '../services/post.service'
import { getUserOwnedGroups } from '../services/group.service'

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
  getPosts: async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 0
    const postsOrError = await getPosts(page)
    if (postsOrError instanceof Error) return sendError(postsOrError, res)
    return res.json(postsOrError)
  },
  updatePost: async (req: Request<any, any, EditPostData & { jwtPayload: { id: number } }>, res: Response) => {
    const uid = req.body.jwtPayload.id
    const gid = req.body.idGroup
    if (uid !== req.body.idUser) {
      const userGroups = await getUserOwnedGroups(uid, 'all', true)
      if (userGroups instanceof Error) return sendError(userGroups, res)
      const isOwner = userGroups.reduce<boolean>((is, { id }) => is || id === gid, false)
      if (!isOwner) return sendError(new RequestError(403), res)
    }
    const postOrError = await updatePost({
      title: req.body.title,
      content: req.body.content,
      id: req.body.id,
      idGroup: req.body.idGroup,
      idUser: req.body.idUser
    })
    if (postOrError instanceof Error) return sendError(postOrError, res)
    return res.json(postOrError)
  },
  deletePost: async (req: Request<any, any, DeletePostData & { jwtPayload: { id: number } }>, res: Response) => {
    const uid = req.body.jwtPayload.id
    const gid = req.body.idGroup
    if (uid !== req.body.idUser) {
      const userGroups = await getUserOwnedGroups(uid, 'all', true)
      if (userGroups instanceof Error) return sendError(userGroups, res)
      const isOwner = userGroups.reduce<boolean>((is, { id }) => is || id === gid, false)
      if (!isOwner) return sendError(new RequestError(403), res)
    }
    const postOrError = await deletePost(req.body.id)
    if (postOrError instanceof Error) return sendError(postOrError, res)
    return res.json({ success: true })
  }
}

export default PostController
