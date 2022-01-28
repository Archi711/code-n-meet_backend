import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export default (soft = false) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return soft ? next() : res.sendStatus(401)
    try {
      const jwtPayload = jwt.verify(token, process.env.JWT_SECRET as string)
      req.body = {
        ...req.body,
        jwtPayload,
      }
      return next()
    } catch (e) {
      return soft ? next() : res.sendStatus(403)
    }
  }
