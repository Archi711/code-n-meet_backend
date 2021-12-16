import consola from 'consola'
import isEmpty from 'lodash/isEmpty'
import usersService from './users.service'
import express from 'express'

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
  const service = {}
  Object.entries(servicesObject).forEach(
    ([key, handler]) => (service[key] = buildHandler(handler))
  )
  return service
}

const UserService = Service(usersService)
