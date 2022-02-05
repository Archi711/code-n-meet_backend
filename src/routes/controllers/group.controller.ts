import { EditGroupData, GroupCreateBody } from './../../types/index'
import { RequestError, sendError } from './../../types/utils'
import { Request, Response } from 'express'
import {
  addToGroup,
  createGroup,
  deleteGroup,
  editGroup,
  getGroupById,
  getGroups,
  getUserGroups,
  GroupPrivacySP,
  removeFromGroup,
} from '../services/group.service'
import { omit } from 'lodash'

export default {
  getUserGroups: async (req: Request, res: Response) => {
    const groups = await getUserGroups(
      Number(req.params.id),
      req.query.privacy as GroupPrivacySP
    )
    if (groups instanceof Error) return sendError(groups, res)
    const userId = req.body?.jwtPayload?.id
    if (!userId || userId !== +req.params.id) {
      return res.json(groups.filter((group) => !group.isPrivate))
    }
    return res.json(groups)
  },
  getGroupById: async (req: Request, res: Response) => {
    const group = await getGroupById(+req.params.id)
    if (group instanceof Error) return sendError(group, res)
    if (!group.isPrivate) return res.json(group)
    const userId = req.body?.jwtPayload?.id
    // create a limit && || dict??
    const userInGroup = group.Users.filter(({ id }) => id === +userId)
    if (!!userInGroup && userId) return res.json(group)
    return res.sendStatus(403)
  },
  createGroup: async (
    req: Request<any, any, GroupCreateBody & { jwtPayload: { id: number } }>,
    res: Response
  ) => {
    const group = await createGroup(
      req.body.jwtPayload.id,
      omit(req.body, 'jwtPayload')
    )
    return res.json(group)
  },
  getGroups: async (req: Request, res: Response) => {
    const groups = await getGroups(req.query.skip ? +req.query.skip : undefined)
    return res.json(groups)
  },
  addUserToGroup: async (req: Request, res: Response) => {
    const updated = await addToGroup(Number(req.params.id), {
      login: req.body.login,
      id: req.body.id,
    })
    if (!req.body.login && !req.body.id)
      return sendError(new RequestError(400), res)
    if (updated instanceof Error) return sendError(updated, res)
    return res.json({ success: true })
  },
  removeFromGroup: async (req: Request, res: Response) => {
    const updated = await removeFromGroup(Number(req.params.id), req.body.id)
    if (updated instanceof Error) return sendError(updated, res)
    return res.json({ success: true })
  },
  editGroup: async (req: Request<any, any, EditGroupData & { jwtPayload: { id: number } }>, res: Response) => {
    const uid = req.body.jwtPayload.id
    const gData = await getGroupById(Number(req.params.id))
    if (gData instanceof Error) return sendError(gData, res)
    if (gData.User.id !== uid) return sendError(new RequestError(403), res)
    const group = await editGroup(Number(req.params.id), omit(req.body, 'jwtPayload'))
    if (group instanceof Error) return sendError(group, res)
    return res.json(group)
  },
  deleteGroup: async (req: Request<any, any, { jwtPayload: { id: number } }>, res: Response) => {
    const uid = req.body.jwtPayload.id
    const gData = await getGroupById(Number(req.params.id))
    if (gData instanceof Error) return sendError(gData, res)
    if (gData.User.id !== uid) return sendError(new RequestError(403), res)
    const group = await deleteGroup(Number(req.params.id))
    if (group instanceof Error) return sendError(group, res)
    return res.json({ success: true })

  }
}
