import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export default async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.sendStatus(401)
  try {
    const jwtPayload = jwt.verify(token, process.env.JWT_SECRET as string)
    req.body.jwtPayload = jwtPayload
    return next()
  } catch (e) {
    return res.sendStatus(403)
  }
}
