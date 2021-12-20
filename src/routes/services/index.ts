import consola from 'consola'
import isEmpty from 'lodash/isEmpty'

export function buildHandler(handler: any) {
  return async function (param: any): Promise<any | false> {
    try {
      const result = await handler(param)
      if (isEmpty(result)) throw new Error('Empty result!')
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
