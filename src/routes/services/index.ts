import consola from 'consola'
import isEmpty from 'lodash/isEmpty'
import express from 'express'
import { RequestDataTypes } from '../../types/index'

const asServiceTypes = <T>(et: { [K in keyof T]: ServiceAction }) => et
const router = express()

export type ServiceAction = <T, R>(params: T) => Promise<R>

export function buildHandler<T, R>(handler: ServiceAction) {
  return async function (param: T): Promise<R | false> {
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
  const service: typeof typesSrv = {}
  Object.entries(servicesObject).forEach(
    ([key, handler]) => (service[key] = buildHandler(handler))
  )
  return service
}
