import consola from 'consola'
import isEmpty from 'lodash/isEmpty'
import { RequestError } from '../../types/utils'

export function buildHandler(handler: any) {
  return async function (...params: any): Promise<any | false> {
    try {
      const result = await handler(...params)
      if (isEmpty(result)) throw new RequestError(404)
      else return result
    } catch (e: any) {
      consola.error(e)
      return e
    }
  }
}

export const createService = <T extends { [key: string]: any }>(serv: T): T => {
  const res: any = {}
  Object.entries(serv).forEach(
    ([key, value]) => (res[key] = buildHandler(value))
  )
  return res
}
