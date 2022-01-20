import { sendError } from './../../types/utils'
import { Request, Response } from 'express'
import { getUserGroups, GroupPrivacySP } from '../services/group.service'

export default {
  getUserGroups: async (req: Request, res: Response) => {
    const groups = await getUserGroups(
      Number(req.query.id),
      req.query.privacy as GroupPrivacySP
    )
    if (groups instanceof Error) return sendError(groups, res)
    const userId = req.body?.jwtPayload?.id
    if (!userId || userId !== +req.params.id) {
      return res.json(groups.filter((group) => !group.isPrivate))
    }
    return res.json(groups)
  },
}
