import consola from 'consola'
import isEmpty from 'lodash/isEmpty'
import usersService from './users.service'
import express from 'express'
function t<V extends string, T extends { [key in string]: V }>(o: T): T {
  return o
}
const asServiceTypes = <T>(et: { [K in keyof T]: ServiceAction }) => et
const router = express()

export type ServiceAction = (params: any) => Promise<any>

export function buildHandler(handler: ServiceAction): any | false {
  return async function (param: any) {
    try {
      const result = await handler(param)
      if (isEmpty(result)) throw new Error('Empty result!')
      else return result
    } catch (e) {
      consola.error(e)
      return false
    }
  }
}

export function Service(servicesObject: { [key: string]: ServiceAction }) {
  const typesSrv = asServiceTypes(servicesObject)
  const service: { [key: keyof typeof typesSrv]: ServiceAction } = {}
  Object.entries(servicesObject).forEach(
    ([key, handler]) => (service[key] = buildHandler(handler))
  )
  return service
}

const UserService = Service(usersService)
